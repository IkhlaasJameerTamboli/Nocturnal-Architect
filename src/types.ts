/**
 * Priority levels for tasks.
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * Task interface representing a single objective in the system.
 */
export interface Task {
  id: string;
  title: string;
  meta: string;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  due?: string;
  xp: number;
  users?: string[];
  files?: number;
  chats?: number;
}

/**
 * Analytics data structure for charts.
 */
export interface AnalyticsData {
  day: string;
  tasks: number;
}
