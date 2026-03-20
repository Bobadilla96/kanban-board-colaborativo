import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { isValidCardTitle } from '@/lib/validation';
import { useBoardStore } from '@/store/board.store';
import type { Member, Priority } from '@/types/board.types';

interface AddCardButtonProps {
  columnId: string;
  members: Member[];
}

export function AddCardButton({ columnId, members }: AddCardButtonProps) {
  const addCard = useBoardStore((state) => state.addCard);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creationError, setCreationError] = useState<string | null>(null);

  const reset = () => {
    setTitle('');
    setDescription('');
    setPriority('none');
    setAssigneeId('');
    setDueDate('');
    setCreationError(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const safeTitle = title.trim();
    if (!isValidCardTitle(safeTitle)) {
      setCreationError('El titulo de la tarjeta es obligatorio.');
      return;
    }

    const createdCardId = addCard(columnId, {
      title: safeTitle,
      description: description.trim() || 'Descripcion pendiente.',
      assigneeId: assigneeId || null,
      priority,
      labels: [],
      dueDate: dueDate || null,
      checklist: [],
      attachments: 0,
      comments: 0
    });

    if (!createdCardId) {
      setCreationError('No se pudo crear la tarjeta. Verifica los datos e intenta de nuevo.');
      return;
    }

    setOpen(false);
    reset();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-400 hover:text-cyan-700"
      >
        <Plus className="h-4 w-4" />
        Agregar tarjeta
      </button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Nueva tarjeta"
        description="Carga los datos principales para crear una tarea completa."
      >
        <form className="grid gap-3" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Titulo
            <input
              autoFocus
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (creationError) {
                  setCreationError(null);
                }
              }}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Ejemplo: Ajustar validacion de login"
              required
            />
          </label>

          {creationError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
              {creationError}
            </p>
          ) : null}

          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Descripcion
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-20 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-cyan-500"
              placeholder="Objetivo, alcance y detalles."
            />
          </label>

          <div className="grid gap-2">
            <label className="grid min-w-0 gap-1 text-sm font-semibold text-slate-700">
              Prioridad
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
                className="min-w-0 w-full rounded-xl border border-slate-300 px-2 py-2 text-sm"
              >
                <option value="none">Sin prioridad</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </label>

            <label className="grid min-w-0 gap-1 text-sm font-semibold text-slate-700">
              Responsable
              <select
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
                className="min-w-0 w-full rounded-xl border border-slate-300 px-2 py-2 text-sm"
              >
                <option value="">Sin asignar</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid min-w-0 gap-1 text-sm font-semibold text-slate-700">
              Fecha limite
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="min-w-0 w-full rounded-xl border border-slate-300 px-2 py-2 text-sm"
              />
            </label>
          </div>

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
              <Plus className="h-4 w-4" />
              Crear tarjeta
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
