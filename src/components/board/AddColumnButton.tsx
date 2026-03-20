import { useState } from 'react';
import type { FormEvent } from 'react';
import { Columns3, Plus } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { parsePositiveInt } from '@/lib/validation';
import { useBoardStore } from '@/store/board.store';

export function AddColumnButton() {
  const addColumn = useBoardStore((state) => state.addColumn);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [wipLimit, setWipLimit] = useState('');

  const reset = () => {
    setTitle('');
    setWipLimit('');
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    addColumn({
      title,
      wipLimit: parsePositiveInt(wipLimit) ?? undefined
    });

    setOpen(false);
    reset();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-fit w-[280px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-cyan-300 bg-cyan-50 px-4 py-3 text-sm font-bold text-cyan-800 transition hover:border-cyan-500 hover:bg-cyan-100"
      >
        <Plus className="h-4 w-4" />
        Nueva columna
      </button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Crear columna"
        description="Define el nombre y, opcionalmente, un limite de trabajo en progreso."
      >
        <form className="grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Nombre de columna
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Ejemplo: Listo para QA"
              required
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Limite WIP (opcional)
            <input
              value={wipLimit}
              onChange={(event) => setWipLimit(event.target.value)}
              type="number"
              min={1}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Ejemplo: 5"
            />
          </label>

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <Columns3 className="h-4 w-4" />
              Crear columna
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
