export interface Board {
  id: string;
  name: string;
  description: string;
  members: Member[];
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  wipLimit?: number;
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  priority: Priority;
  labels: Label[];
  dueDate: string | null;
  checklist: ChecklistItem[];
  attachments: number;
  comments: number;
  activity: ActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface Filters {
  assignee: string | null;
  priority: Priority | null;
  label: string | null;
  dueDateRange: 'overdue' | 'this_week' | 'no_date' | null;
  search: string;
}

export type NewBoardInput = {
  name: string;
  description: string;
  members: Member[];
  columns: Column[];
};

export type NewCardInput = Omit<Card, 'id' | 'activity' | 'createdAt' | 'updatedAt'>;

export const DEFAULT_FILTERS: Filters = {
  assignee: null,
  priority: null,
  label: null,
  dueDateRange: null,
  search: ''
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string }> = {
  none: { label: 'Sin prioridad', color: '#94a3b8', icon: '-' },
  low: { label: 'Baja', color: '#2563eb', icon: 'v' },
  medium: { label: 'Media', color: '#f59e0b', icon: '>' },
  high: { label: 'Alta', color: '#f97316', icon: '^' },
  urgent: { label: 'Urgente', color: '#ef4444', icon: '^^' }
};

export const DEFAULT_LABELS: Label[] = [
  { id: 'l1', name: 'Bug', color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#10b981' },
  { id: 'l3', name: 'Mejora', color: '#3b82f6' },
  { id: 'l4', name: 'Documentacion', color: '#8b5cf6' },
  { id: 'l5', name: 'Urgente', color: '#f97316' },
  { id: 'l6', name: 'Backend', color: '#6366f1' },
  { id: 'l7', name: 'Frontend', color: '#06b6d4' },
  { id: 'l8', name: 'Diseno', color: '#ec4899' }
];
