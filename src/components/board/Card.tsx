import { memo } from 'react';
import { CalendarDays, MessageSquareMore, Paperclip, SquareCheckBig, UserRound } from 'lucide-react';
import { formatDistanceToNow, isBefore, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PRIORITY_CONFIG } from '@/types/board.types';
import type { Card as CardType, Member } from '@/types/board.types';

interface CardProps {
  card: CardType;
  members: Member[];
}

function CardComponent({ card, members }: CardProps) {
  const assignee = members.find((member) => member.id === card.assigneeId);
  const completedChecklist = card.checklist.filter((item) => item.completed).length;
  const hasDueDate = Boolean(card.dueDate);
  const isOverdue = Boolean(card.dueDate && isBefore(parseISO(card.dueDate), new Date()));
  const priority = PRIORITY_CONFIG[card.priority];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-2 flex flex-wrap gap-1">
        {card.labels.map((label) => (
          <span
            key={label.id}
            title={label.name}
            className="h-2 w-6 rounded-full"
            style={{ backgroundColor: label.color }}
          />
        ))}
      </div>

      <h4 className="text-sm font-semibold text-slate-900">{card.title}</h4>
      <p className="mt-1 line-clamp-2 text-xs text-slate-600">{card.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span
          className="rounded-full border px-2 py-1 font-medium"
          style={{ borderColor: priority.color, color: priority.color }}
        >
          {priority.icon} {priority.label}
        </span>

        {hasDueDate && card.dueDate ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-medium ${
              isOverdue
                ? 'border-rose-300 bg-rose-50 text-rose-700'
                : 'border-slate-300 bg-slate-50 text-slate-600'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDistanceToNow(parseISO(card.dueDate), { addSuffix: true, locale: es })}
          </span>
        ) : null}

        {card.checklist.length > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-slate-600">
            <SquareCheckBig className="h-3.5 w-3.5" />
            {completedChecklist}/{card.checklist.length}
          </span>
        ) : null}

        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-slate-600">
          <MessageSquareMore className="h-3.5 w-3.5" />
          {card.comments}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-slate-600">
          <Paperclip className="h-3.5 w-3.5" />
          {card.attachments}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-xs font-medium text-white">
          <UserRound className="h-3.5 w-3.5" />
          {assignee?.avatar ?? 'NA'}
        </span>
      </div>
    </article>
  );
}

export const Card = memo(CardComponent);
