import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

import {
  useNotifications,
  useNotificationActions,
  type Notification,
} from '@/stores/notifications';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-background text-foreground border-border',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  warning:
    'bg-orange-50 text-orange-900 border-orange-200 dark:bg-orange-950 dark:text-orange-100 dark:border-orange-800',
  info: 'bg-muted text-muted-foreground border-border',
};

const iconColorMap = {
  success: 'text-green-600 dark:text-green-400',
  error: 'text-destructive',
  warning: 'text-orange-600 dark:text-orange-400',
  info: 'text-muted-foreground',
};

type NotificationItemProps = {
  notification: Notification;
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const { dismissNotification } = useNotificationActions();

  const Icon = iconMap[notification.type];

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ${colorMap[notification.type]} animate-in slide-in-from-right-full duration-300`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon
              className={`h-6 w-6 ${iconColorMap[notification.type]}`}
              aria-hidden="true"
            />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {notification.title && (
              <p className="text-sm font-medium">{notification.title}</p>
            )}
            <p className={`text-sm ${notification.title ? 'mt-1' : ''}`}>
              {notification.message}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => dismissNotification(notification.id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Notifications() {
  const notifications = useNotifications();

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
