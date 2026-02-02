import { create } from 'zustand';

import { uid } from '@/lib/uid';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export type Notification = {
  id: string;
  type: NotificationType;
  title?: string;
  duration?: number;
  message?: string;
};

type NotificationsStore = {
  notifications: Notification[];
  actions: {
    showNotification: (notification: Omit<Notification, 'id'>) => void;
    dismissNotification: (id: string) => void;
  };
};

const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  actions: {
    showNotification: (notification) => {
      const id = uid();
      const duration = notification.duration ?? 5000;

      set((state) => ({
        notifications: [
          ...state.notifications,
          { id, duration, ...notification },
        ],
      }));
      if (duration > 0) {
        setTimeout(() => {
          get().actions.dismissNotification(id);
        }, duration);
      }
    },
    dismissNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification.id !== id,
        ),
      }));
    },
  },
}));

export const useNotifications = () =>
  useNotificationsStore((state) => state.notifications);

export const useNotificationActions = () =>
  useNotificationsStore((state) => state.actions);
