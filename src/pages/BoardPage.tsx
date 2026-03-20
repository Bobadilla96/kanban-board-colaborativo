import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Board } from '@/components/board/Board';
import { useBoardStore } from '@/store/board.store';
import { useUIStore } from '@/store/ui.store';
import { DEFAULT_LABELS } from '@/types/board.types';

export function BoardPage() {
  const navigate = useNavigate();
  const params = useParams<{ boardId: string }>();

  const boards = useBoardStore((state) => state.boards);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);

  const filters = useUIStore((state) => state.filters);
  const setFilter = useUIStore((state) => state.setFilter);
  const clearFilters = useUIStore((state) => state.clearFilters);

  useEffect(() => {
    if (!params.boardId) {
      navigate('/boards');
      return;
    }
    setActiveBoard(params.boardId);
  }, [navigate, params.boardId, setActiveBoard]);

  const board = useMemo(
    () => boards.find((item) => item.id === activeBoardId),
    [boards, activeBoardId]
  );

  if (!board) {
    return (
      <>
        <Header />
        <main className="shell">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            No encontramos el tablero solicitado.
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header showBoardSelector />
      <main className="shell grid gap-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Kanban colaborativo</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{board.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{board.description}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              type="text"
              value={filters.search}
              onChange={(event) => setFilter('search', event.target.value)}
              placeholder="Buscar por titulo o descripcion"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500"
            />

            <select
              value={filters.assignee ?? ''}
              onChange={(event) => setFilter('assignee', event.target.value || null)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Responsable: todos</option>
              {board.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>

            <select
              value={filters.priority ?? ''}
              onChange={(event) =>
                setFilter(
                  'priority',
                  (event.target.value || null) as 'none' | 'low' | 'medium' | 'high' | 'urgent' | null
                )
              }
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Prioridad: todas</option>
              <option value="none">Sin prioridad</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>

            <select
              value={filters.label ?? ''}
              onChange={(event) => setFilter('label', event.target.value || null)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="">Label: todas</option>
              {DEFAULT_LABELS.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        <Board board={board} filters={filters} />
      </main>
    </>
  );
}
