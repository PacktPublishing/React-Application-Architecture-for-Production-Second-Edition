import { renderHook, act } from 'testing/test-utils';

import { useNotifications, useNotificationActions } from '../notifications';

describe('notifications store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add a notification', () => {
    const { result: actions } = renderHook(() => useNotificationActions());
    const { result: notifications } = renderHook(() => useNotifications());

    act(() => {
      actions.current.showNotification({
        type: 'success',
        title: 'Test notification',
        message: 'Test message',
      });
    });

    expect(notifications.current).toHaveLength(1);
    expect(notifications.current[0]).toMatchObject({
      type: 'success',
      title: 'Test notification',
      message: 'Test message',
    });
  });

  it('should dismiss a notification', () => {
    const { result: actions } = renderHook(() => useNotificationActions());
    const { result: notifications } = renderHook(() => useNotifications());

    act(() => {
      actions.current.showNotification({
        type: 'info',
        title: 'Test',
      });
    });

    const notificationId = notifications.current[0].id;

    act(() => {
      actions.current.dismissNotification(notificationId);
    });

    expect(notifications.current).toHaveLength(0);
  });

  it('should auto-dismiss after duration', () => {
    const { result: actions } = renderHook(() => useNotificationActions());
    const { result: notifications } = renderHook(() => useNotifications());

    act(() => {
      actions.current.showNotification({
        type: 'success',
        title: 'Auto dismiss',
        duration: 3000,
      });
    });

    expect(notifications.current).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(notifications.current).toHaveLength(0);
  });
});
