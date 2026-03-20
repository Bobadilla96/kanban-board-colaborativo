import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertTriangle, Settings2, Trash2 } from 'lucide-react';
import { AddCardButton } from '@/components/board/AddCardButton';
import { Card } from '@/components/board/Card';
import { Dialog } from '@/components/ui/dialog';
import { useBoardStore } from '@/store/board.store';
import type { Column as ColumnType, Member } from '@/types/board.types';

interface ColumnProps {
  column: ColumnType;
  members: Member[];
}

export function Column({ column, members }: ColumnProps) {
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const exceedsWip = Boolean(column.wipLimit && column.cards.length > column.wipLimit);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [wipLimit, setWipLimit] = useState(column.wipLimit ? String(column.wipLimit) : '');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const openSettings = () => {
    setTitle(column.title);
    setWipLimit(column.wipLimit ? String(column.wipLimit) : '');
    setDeleteConfirmation('');
    setSettingsOpen(true);
  };

  const onSaveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    const parsedWip = Number(wipLimit);
    updateColumn(column.id, {
      title: title.trim(),
      wipLimit: wipLimit.trim() && Number.isFinite(parsedWip) && parsedWip > 0 ? parsedWip : undefined
    });
    setSettingsOpen(false);
  };

  const canDelete = deleteConfirmation.trim().toLowerCase() === column.title.trim().toLowerCase();

  return (
    <>
      <section className="grid h-fit w-[340px] shrink-0 gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
        <header
          className={`rounded-xl border px-3 py-2 ${
            exceedsWip ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{column.title}</h3>
              <p className="text-xs text-slate-500">
                {column.cards.length} tarjetas{column.wipLimit ? ` / WIP ${column.wipLimit}` : ''}
              </p>
            </div>
            {exceedsWip ? <AlertTriangle className="h-4 w-4 text-rose-600" /> : null}
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Configurar columna
            </button>
          </div>
        </header>

        <div className="grid gap-2">
          {column.cards.map((card) => (
            <Card key={card.id} card={card} members={members} />
          ))}
        </div>

        <AddCardButton columnId={column.id} members={members} />
      </section>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Configuracion de columna"
        description="Ajusta el nombre, limite WIP o elimina la columna de forma segura."
      >
        <form className="grid gap-4" onSubmit={onSaveSettings}>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Nombre de columna
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              required
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Limite WIP (opcional)
            <input
              type="number"
              min={1}
              value={wipLimit}
              onChange={(event) => setWipLimit(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Sin limite"
            />
          </label>

          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-sm font-semibold text-rose-700">Zona de eliminacion</p>
            <p className="mt-1 text-xs text-rose-600">
              Escribe <strong>{column.title}</strong> para habilitar el borrado permanente.
            </p>
            <input
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              placeholder="Nombre exacto de la columna"
            />
            <button
              type="button"
              disabled={!canDelete}
              onClick={() => {
                if (!canDelete) {
                  return;
                }
                deleteColumn(column.id);
                setSettingsOpen(false);
              }}
              className="mt-2 inline-flex items-center gap-1 rounded-xl border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar columna
            </button>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
