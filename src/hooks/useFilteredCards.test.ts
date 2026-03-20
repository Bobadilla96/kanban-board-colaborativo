import { DEFAULT_FILTERS } from '@/types/board.types';
import { filterColumns } from '@/hooks/useFilteredCards';
import type { Column } from '@/types/board.types';

const columnsFixture: Column[] = [
  {
    id: 'col-a',
    title: 'Todo',
    order: 0,
    cards: [
      {
        id: 'card-1',
        title: 'Fix login bug',
        description: 'Update auth hook',
        assigneeId: 'u1',
        priority: 'high',
        labels: [{ id: 'l1', name: 'Bug', color: '#f00' }],
        dueDate: '2025-01-01',
        checklist: [],
        attachments: 0,
        comments: 1,
        activity: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'card-2',
        title: 'Write docs',
        description: 'Draft onboarding guide',
        assigneeId: null,
        priority: 'low',
        labels: [{ id: 'l4', name: 'Docs', color: '#0ff' }],
        dueDate: null,
        checklist: [],
        attachments: 0,
        comments: 0,
        activity: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
];

describe('filterColumns', () => {
  it('filters by search text and priority with AND semantics', () => {
    const result = filterColumns(columnsFixture, {
      ...DEFAULT_FILTERS,
      search: 'login',
      priority: 'high'
    });

    expect(result.totalCards).toBe(2);
    expect(result.visibleCards).toBe(1);
    expect(result.filteredColumns[0].cards[0].id).toBe('card-1');
  });

  it('filters by label and assignee', () => {
    const result = filterColumns(columnsFixture, {
      ...DEFAULT_FILTERS,
      label: 'l4',
      assignee: 'u1'
    });

    expect(result.visibleCards).toBe(0);
  });

  it('filters cards without due date', () => {
    const result = filterColumns(columnsFixture, {
      ...DEFAULT_FILTERS,
      dueDateRange: 'no_date'
    });

    expect(result.visibleCards).toBe(1);
    expect(result.filteredColumns[0].cards[0].id).toBe('card-2');
  });
});
