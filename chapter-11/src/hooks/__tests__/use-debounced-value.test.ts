import { renderHook, act } from 'testing/test-utils';

import { useDebouncedValue } from '../use-debounced-value';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    );

    rerender({ value: 'first', delay: 500 });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: 'second', delay: 500 });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: 'final', delay: 500 });

    expect(result.current).toBe('initial');

    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe('final');
  });
});
