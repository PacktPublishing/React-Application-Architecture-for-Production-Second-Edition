export function formatDate(date: string | Date, locale: string = 'en'): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.error(`Invalid date: "${date}"`);
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}
