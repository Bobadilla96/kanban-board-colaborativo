import { useMemo } from 'react';
import { isBefore, isThisWeek, parseISO } from 'date-fns';
import type { Column, Filters } from '@/types/board.types';

export const filterColumns = (columns: Column[], filters: Filters) => {
  const today = new Date();
  const searchQuery = filters.search.trim().toLowerCase();

  const filteredColumns = columns.map((column) => {
    const cards = column.cards.filter((card) => {
      if (
        searchQuery &&
        !card.title.toLowerCase().includes(searchQuery) &&
        !card.description.toLowerCase().includes(searchQuery)
      ) {
        return false;
      }

      if (filters.assignee && card.assigneeId !== filters.assignee) {
        return false;
      }

      if (filters.priority && card.priority !== filters.priority) {
        return false;
      }

      if (filters.label && !card.labels.some((label) => label.id === filters.label)) {
        return false;
      }

      if (filters.dueDateRange === 'overdue') {
        if (!card.dueDate || !isBefore(parseISO(card.dueDate), today)) {
          return false;
        }
      }

      if (filters.dueDateRange === 'this_week') {
        if (!card.dueDate || !isThisWeek(parseISO(card.dueDate))) {
          return false;
        }
      }

      if (filters.dueDateRange === 'no_date' && card.dueDate) {
        return false;
      }

      return true;
    });

    return {
      ...column,
      cards
    };
  });

  const totalCards = columns.reduce((acc, column) => acc + column.cards.length, 0);
  const visibleCards = filteredColumns.reduce((acc, column) => acc + column.cards.length, 0);

  return {
    filteredColumns,
    totalCards,
    visibleCards
  };
};

export function useFilteredCards(columns: Column[], filters: Filters) {
  return useMemo(() => filterColumns(columns, filters), [columns, filters]);
}
