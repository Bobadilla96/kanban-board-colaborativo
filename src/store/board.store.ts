import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MOCK_BOARDS } from '@/data/boards.mock';
import { generateId } from '@/lib/id';
import { getSafeStorage } from '@/lib/storage';
import { isValidName, sanitizeText } from '@/lib/validation';
import type { Board, Card, Column, NewBoardInput, NewCardInput } from '@/types/board.types';

type NewColumnInput = {
  title: string;
  wipLimit?: number;
};

export interface BoardState {
  boards: Board[];
  activeBoardId: string;
  setActiveBoard: (id: string) => void;
  addBoard: (board: NewBoardInput) => string;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  addColumn: (column: NewColumnInput) => string | null;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  addCard: (columnId: string, card: NewCardInput) => string | null;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  toggleChecklistItem: (cardId: string, itemId: string) => void;
  addChecklistItem: (cardId: string, text: string) => void;
}

const nowIso = () => new Date().toISOString();

const getInitialState = () => ({
  boards: MOCK_BOARDS,
  activeBoardId: MOCK_BOARDS[0]?.id ?? ''
});

const createActivity = (action: string) => ({
  id: generateId('act'),
  userId: 'system',
  userName: 'Sistema',
  action,
  timestamp: nowIso()
});

const appendActivity = (card: Card, action: string): Card => ({
  ...card,
  updatedAt: nowIso(),
  activity: [createActivity(action), ...card.activity]
});

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

const updateBoardById = (
  boards: Board[],
  boardId: string,
  updater: (board: Board) => Board
): Board[] => boards.map((board) => (board.id === boardId ? updater(board) : board));

const sanitizeDescription = (value: string): string => sanitizeText(value || '');

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      ...getInitialState(),

      setActiveBoard: (id) =>
        set((state) => {
          if (!state.boards.some((board) => board.id === id)) {
            return state;
          }
          return { activeBoardId: id };
        }),

      addBoard: (boardInput) => {
        const boardId = generateId('board');
        const timestamp = nowIso();
        const safeName = sanitizeText(boardInput.name);
        const safeDescription = sanitizeDescription(boardInput.description);
        const columns = boardInput.columns.map((column, index) => ({
          ...column,
          title: sanitizeText(column.title),
          order: index
        }));

        if (!isValidName(safeName) || columns.length === 0) {
          return '';
        }

        const board: Board = {
          ...boardInput,
          id: boardId,
          name: safeName,
          description: safeDescription,
          columns,
          createdAt: timestamp,
          updatedAt: timestamp
        };

        set((state) => ({
          boards: [...state.boards, board],
          activeBoardId: board.id
        }));

        return board.id;
      },

      updateBoard: (id, updates) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== id) {
              return board;
            }

            const safeName =
              typeof updates.name === 'string' && isValidName(updates.name)
                ? sanitizeText(updates.name)
                : board.name;
            const safeDescription =
              typeof updates.description === 'string'
                ? sanitizeDescription(updates.description)
                : board.description;

            return {
              ...board,
              ...updates,
              id: board.id,
              name: safeName,
              description: safeDescription,
              updatedAt: nowIso()
            };
          })
        })),

      deleteBoard: (id) =>
        set((state) => {
          const boards = state.boards.filter((board) => board.id !== id);
          return {
            boards,
            activeBoardId:
              state.activeBoardId === id ? (boards[0]?.id ?? '') : state.activeBoardId
          };
        }),

      addColumn: (columnInput) => {
        const safeTitle = sanitizeText(columnInput.title);
        if (!isValidName(safeTitle)) {
          return null;
        }

        const columnId = generateId('col');
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: [
              ...board.columns,
              {
                id: columnId,
                title: safeTitle,
                order: board.columns.length,
                wipLimit: columnInput.wipLimit && columnInput.wipLimit > 0 ? columnInput.wipLimit : undefined,
                cards: []
              }
            ]
          }))
        }));

        return columnId;
      },

      updateColumn: (columnId, updates) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: board.columns.map((column) => {
              if (column.id !== columnId) {
                return column;
              }

              const nextTitle =
                typeof updates.title === 'string' && isValidName(updates.title)
                  ? sanitizeText(updates.title)
                  : column.title;

              const nextWipLimit =
                typeof updates.wipLimit === 'number' && updates.wipLimit > 0
                  ? Math.floor(updates.wipLimit)
                  : undefined;

              return {
                ...column,
                ...updates,
                id: column.id,
                title: nextTitle,
                wipLimit: nextWipLimit
              };
            })
          }))
        })),

      deleteColumn: (columnId) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => {
            if (board.columns.length <= 1) {
              return board;
            }

            return {
              ...board,
              updatedAt: nowIso(),
              columns: board.columns
                .filter((column) => column.id !== columnId)
                .map((column, index) => ({ ...column, order: index }))
            };
          })
        })),

      reorderColumns: (columnIds) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => {
            const byId = new Map(board.columns.map((column) => [column.id, column]));
            const picked = columnIds
              .map((id) => byId.get(id))
              .filter((column): column is Column => Boolean(column));
            const missing = board.columns.filter((column) => !columnIds.includes(column.id));

            const nextColumns = [...picked, ...missing].map((column, index) => ({
              ...column,
              order: index
            }));

            return {
              ...board,
              updatedAt: nowIso(),
              columns: nextColumns
            };
          })
        })),

      addCard: (columnId, cardInput) => {
        const safeTitle = sanitizeText(cardInput.title);
        if (!isValidName(safeTitle)) {
          return null;
        }

        const cardId = generateId('card');
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: board.columns.map((column) => {
              if (column.id !== columnId) {
                return column;
              }

              const card: Card = {
                ...cardInput,
                id: cardId,
                title: safeTitle,
                description: sanitizeDescription(cardInput.description),
                dueDate: cardInput.dueDate ?? null,
                activity: [createActivity(`creo la tarjeta "${safeTitle}"`)],
                createdAt: nowIso(),
                updatedAt: nowIso()
              };

              return {
                ...column,
                cards: [...column.cards, card]
              };
            })
          }))
        }));

        return cardId;
      },

      updateCard: (cardId, updates) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: board.columns.map((column) => ({
              ...column,
              cards: column.cards.map((card) => {
                if (card.id !== cardId) {
                  return card;
                }

                const nextTitle =
                  typeof updates.title === 'string' && isValidName(updates.title)
                    ? sanitizeText(updates.title)
                    : card.title;
                const nextDescription =
                  typeof updates.description === 'string'
                    ? sanitizeDescription(updates.description)
                    : card.description;

                const updatedCard: Card = {
                  ...card,
                  ...updates,
                  id: card.id,
                  title: nextTitle,
                  description: nextDescription
                };
                return appendActivity(updatedCard, `actualizo la tarjeta "${updatedCard.title}"`);
              })
            }))
          }))
        })),

      deleteCard: (cardId) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: board.columns.map((column) => ({
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId)
            }))
          }))
        })),

      moveCard: (cardId, fromColumnId, toColumnId, newIndex) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => {
            const fromColumn = board.columns.find((column) => column.id === fromColumnId);
            const toColumn = board.columns.find((column) => column.id === toColumnId);
            if (!fromColumn || !toColumn) {
              return board;
            }

            const sourceIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
            if (sourceIndex === -1) {
              return board;
            }

            if (fromColumnId === toColumnId && sourceIndex === newIndex) {
              return board;
            }

            const card = fromColumn.cards[sourceIndex];
            const withoutCard = board.columns.map((column) =>
              column.id === fromColumnId
                ? { ...column, cards: column.cards.filter((item) => item.id !== cardId) }
                : column
            );

            return {
              ...board,
              updatedAt: nowIso(),
              columns: withoutCard.map((column) => {
                if (column.id !== toColumnId) {
                  return column;
                }
                const insertAt = clamp(newIndex, 0, column.cards.length);
                const cards = [...column.cards];
                cards.splice(
                  insertAt,
                  0,
                  appendActivity(
                    { ...card },
                    `movio esta tarjeta de "${fromColumn.title}" a "${toColumn.title}"`
                  )
                );
                return { ...column, cards };
              })
            };
          })
        })),

      toggleChecklistItem: (cardId, itemId) =>
        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: board.columns.map((column) => ({
              ...column,
              cards: column.cards.map((card) => {
                if (card.id !== cardId) {
                  return card;
                }

                const checklist = card.checklist.map((item) =>
                  item.id === itemId ? { ...item, completed: !item.completed } : item
                );
                return appendActivity({ ...card, checklist }, 'actualizo un item del checklist');
              })
            }))
          }))
        })),

      addChecklistItem: (cardId, text) => {
        const safeText = sanitizeText(text);
        if (!safeText) {
          return;
        }

        set((state) => ({
          boards: updateBoardById(state.boards, state.activeBoardId, (board) => ({
            ...board,
            updatedAt: nowIso(),
            columns: board.columns.map((column) => ({
              ...column,
              cards: column.cards.map((card) => {
                if (card.id !== cardId) {
                  return card;
                }
                const checklist = [
                  ...card.checklist,
                  { id: generateId('check'), text: safeText, completed: false }
                ];
                return appendActivity({ ...card, checklist }, `agrego item "${safeText}" al checklist`);
              })
            }))
          }))
        }));
      }
    }),
    {
      name: 'kanban-board-store',
      version: 2,
      storage: createJSONStorage(getSafeStorage),
      partialize: (state) => ({
        boards: state.boards,
        activeBoardId: state.activeBoardId
      }),
      migrate: (persistedState, version) => {
        if (version < 2) {
          return {
            ...getInitialState(),
            ...(persistedState as Partial<BoardState>)
          };
        }
        return persistedState as BoardState;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        const hasValidActiveBoard = state.boards.some((board) => board.id === state.activeBoardId);
        if (!hasValidActiveBoard) {
          const nextId = state.boards[0]?.id ?? '';
          state.setActiveBoard(nextId);
        }
      }
    }
  )
);
