import { MOCK_BOARDS } from '@/data/boards.mock';
import { useBoardStore } from '@/store/board.store';

const cloneBoards = () => JSON.parse(JSON.stringify(MOCK_BOARDS)) as typeof MOCK_BOARDS;

describe('board store', () => {
  beforeEach(() => {
    useBoardStore.setState({
      boards: cloneBoards(),
      activeBoardId: MOCK_BOARDS[0]?.id ?? ''
    });
  });

  it('addBoard returns id and sets active board', () => {
    const id = useBoardStore.getState().addBoard({
      name: '  Nuevo tablero QA  ',
      description: '  tablero de control de calidad  ',
      members: [],
      columns: [
        { id: 'c1', title: 'Backlog', order: 0, cards: [] },
        { id: 'c2', title: 'Done', order: 1, cards: [] }
      ]
    });

    expect(id).toBeTruthy();
    expect(useBoardStore.getState().activeBoardId).toBe(id);
    const created = useBoardStore.getState().boards.find((board) => board.id === id);
    expect(created?.name).toBe('Nuevo tablero QA');
    expect(created?.description).toBe('tablero de control de calidad');
  });

  it('addColumn creates column with sanitized title and optional WIP', () => {
    const columnId = useBoardStore.getState().addColumn({
      title: '  En validacion  ',
      wipLimit: 4
    });

    expect(columnId).toBeTruthy();
    const board = useBoardStore
      .getState()
      .boards.find((item) => item.id === useBoardStore.getState().activeBoardId);
    const column = board?.columns.find((item) => item.id === columnId);

    expect(column?.title).toBe('En validacion');
    expect(column?.wipLimit).toBe(4);
  });

  it('does not delete the last remaining column', () => {
    const activeBoardId = useBoardStore.getState().activeBoardId;
    useBoardStore.setState({
      boards: [
        {
          ...cloneBoards()[0],
          id: activeBoardId,
          columns: [{ id: 'only-col', title: 'Only', order: 0, cards: [] }]
        }
      ],
      activeBoardId
    });

    useBoardStore.getState().deleteColumn('only-col');
    const currentBoard = useBoardStore.getState().boards[0];

    expect(currentBoard.columns).toHaveLength(1);
    expect(currentBoard.columns[0].id).toBe('only-col');
  });

  it('moves a card between columns and appends activity', () => {
    const state = useBoardStore.getState();
    const board = state.boards.find((item) => item.id === state.activeBoardId)!;
    const from = board.columns.find((column) => column.cards.length > 0)!;
    const to = board.columns.find((column) => column.id !== from.id)!;
    const card = from.cards[0];

    const previousActivityCount = card.activity.length;

    useBoardStore.getState().moveCard(card.id, from.id, to.id, 0);

    const updatedBoard = useBoardStore
      .getState()
      .boards.find((item) => item.id === useBoardStore.getState().activeBoardId)!;
    const movedCard = updatedBoard.columns.find((column) => column.id === to.id)!.cards[0];
    const sourceStillContains = updatedBoard.columns
      .find((column) => column.id === from.id)!
      .cards.some((item) => item.id === card.id);

    expect(movedCard.id).toBe(card.id);
    expect(sourceStillContains).toBe(false);
    expect(movedCard.activity.length).toBe(previousActivityCount + 1);
  });
});
