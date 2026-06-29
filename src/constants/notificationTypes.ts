export const NOTIFICATION = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type NotificationType = (typeof NOTIFICATION)[keyof typeof NOTIFICATION]