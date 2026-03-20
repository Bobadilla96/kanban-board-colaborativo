import { AddColumnButton } from '@/components/board/AddColumnButton';
import { Column } from '@/components/board/Column';
import { useFilteredCards } from '@/hooks/useFilteredCards';
import type { Board as BoardType, Filters } from '@/types/board.types';

interface BoardProps {
  board: BoardType;
  filters: Filters;
}

export function Board({ board, filters }: BoardProps) {
  const { filteredColumns, totalCards, visibleCards } = useFilteredCards(board.columns, filters);

  return (
    <section className="grid gap-3">
      <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
        Mostrando {visibleCards} de {totalCards} tarjetas
      </div>

      <div className="flex min-h-[65vh] gap-3 overflow-x-auto pb-2">
        {filteredColumns
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((column) => (
            <Column key={column.id} column={column} members={board.members} />
          ))}
        <AddColumnButton />
      </div>
    </section>
  );
}
