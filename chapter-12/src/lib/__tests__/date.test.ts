import { formatDate } from '../date';

describe('formatDate', () => {
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
});
