import { useState } from 'react';
import type { FormEvent } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { generateId } from '@/lib/id';
import { isValidName } from '@/lib/validation';
import { Dialog } from '@/components/ui/dialog';
import { useBoardStore } from '@/store/board.store';

export function BoardsListPage() {
  const navigate = useNavigate();
  const boards = useBoardStore((state) => state.boards);
  const setActiveBoard = useBoardStore((state) => state.setActiveBoard);
  const addBoard = useBoardStore((state) => state.addBoard);

  const [openCreateBoard, setOpenCreateBoard] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const createBoard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidName(name)) {
      return;
    }

    const templateMembers = boards[0]?.members ?? [];
    const createdBoardId = addBoard({
      name: name.trim(),
      description: description.trim() || 'Tablero generado para organizar tareas del equipo.',
      members: templateMembers,
      columns: [
        {
          id: generateId('col'),
          title: 'Backlog',
          order: 0,
          cards: []
        },
        {
          id: generateId('col'),
          title: 'En progreso',
          order: 1,
          cards: []
        },
        {
          id: generateId('col'),
          title: 'Hecho',
          order: 2,
          cards: []
        }
      ]
    });

    if (createdBoardId) {
      setActiveBoard(createdBoardId);
      navigate(`/boards/${createdBoardId}`);
    }

    setOpenCreateBoard(false);
    resetForm();
  };

  return (
    <>
      <Header />
      <main className="shell grid gap-4">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 px-6 py-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Proyecto 10</p>
            <h1 className="mt-2 text-3xl font-bold">Kanban Board Colaborativo</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-200">
              Gestiona sprints, campañas y flujos internos con estructura profesional, filtros y
              persistencia local.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setOpenCreateBoard(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-50"
              >
                <PlusCircle className="h-4 w-4" />
                Crear tablero
              </button>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tableros activos</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{boards.length}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Columnas totales</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {boards.reduce((acc, board) => acc + board.columns.length, 0)}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tarjetas totales</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {boards.reduce(
                  (acc, board) => acc + board.columns.reduce((sum, column) => sum + column.cards.length, 0),
                  0
                )}
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {boards.map((board) => (
            <article
              key={board.id}
              className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{board.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{board.description}</p>
                </div>
                <span className="rounded-lg bg-slate-100 p-2 text-slate-700">
                  <LayoutDashboard className="h-4 w-4" />
                </span>
              </div>

              <div className="text-xs text-slate-500">
                {board.columns.length} columnas -{' '}
                {board.columns.reduce((acc, col) => acc + col.cards.length, 0)} tarjetas
              </div>
              <p className="text-xs text-slate-500">
                Creado: {format(new Date(board.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
              </p>

              <button
                type="button"
                onClick={() => {
                  setActiveBoard(board.id);
                  navigate(`/boards/${board.id}`);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Abrir tablero
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </section>
      </main>

      <Dialog
        open={openCreateBoard}
        onClose={() => {
          setOpenCreateBoard(false);
          resetForm();
        }}
        title="Crear nuevo tablero"
        description="Define nombre y contexto del tablero. Se crearán columnas base automáticamente."
      >
        <form className="grid gap-3" onSubmit={createBoard}>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Nombre del tablero
            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Ejemplo: Sprint Mobile Q2"
              required
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Descripcion
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Objetivos, alcance y equipo participante."
            />
          </label>

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpenCreateBoard(false);
                resetForm();
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <PlusCircle className="h-4 w-4" />
              Crear tablero
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
