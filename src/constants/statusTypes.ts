export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS]

export const STATUS_TYPES: readonly Status[] = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE];
