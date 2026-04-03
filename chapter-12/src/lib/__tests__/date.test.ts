import { afterEach, vi } from 'vitest';

import { formatDate } from '../date';

describe('formatDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should use English locale by default', () => {
    const result = formatDate('2024-03-15');
    expect(result).toBe('Mar 15, 2024');
  });

  it('should format a date string in English locale', () => {
    const result = formatDate('2024-03-15', 'en');
    expect(result).toBe('Mar 15, 2024');
  });

  it('should format a date string in Spanish locale', () => {
    const result = formatDate('2024-03-15', 'es');
    expect(result).toBe('15 mar 2024');
  });

  it('should format a Date object', () => {
    const date = new Date('2024-03-15T10:00:00Z');
    const result = formatDate(date, 'en');
    expect(result).toBe('Mar 15, 2024');
  });

  it('should handle different months correctly', () => {
    expect(formatDate('2024-01-01', 'en')).toBe('Jan 1, 2024');
    expect(formatDate('2024-12-31', 'en')).toBe('Dec 31, 2024');
  });

  it('should return an empty string and log an error for invalid date strings', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = formatDate('not-a-date', 'en');

    expect(result).toBe('');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid date: "not-a-date"');
  });

  it('should return an empty string and log an error for invalid Date objects', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const invalidDate = new Date('invalid-date');

    const result = formatDate(invalidDate, 'en');

    expect(result).toBe('');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Invalid date: "${invalidDate}"`,
    );
  });

  it('should format with UTC timezone for Date objects', () => {
    const result = formatDate(new Date('2024-03-15T23:30:00-05:00'), 'en');
    expect(result).toBe('Mar 16, 2024');
  });
});
