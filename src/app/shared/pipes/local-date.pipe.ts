import { Pipe, PipeTransform } from '@angular/core';

/**
 * LocalDatePipe — for rendering LocalDate fields (e.g. dueDate, classStartDate)
 *
 * WHY: Angular's built-in DatePipe treats a "YYYY-MM-DD" string as UTC midnight,
 * which causes a -1 day shift for users in negative UTC offsets (e.g. USA).
 * E.g. "2025-06-15" parsed as UTC = Jun 14 at 8PM EST → displays "Jun 14" ❌
 *
 * This pipe parses the date as LOCAL midnight so it always displays the correct
 * calendar date regardless of the user's timezone.
 *
 * Usage: {{ task.dueDate | localDate }}  → "Jun 15, 2025"
 *        {{ task.dueDate | localDate:'short' }} → "Jun 15"
 */
@Pipe({ name: 'localDate', standalone: true })
export class LocalDatePipe implements PipeTransform {
  transform(value: string | null | undefined, format: 'full'|'short'|'month-day' = 'full'): string {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length !== 3) return value;
    const [y, m, d] = parts.map(Number);
    const date = new Date(y, m - 1, d); // LOCAL midnight — no UTC shift

    if (format === 'short') {
      return date.toLocaleDateString(navigator.language, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (format === 'month-day') {
      return date.toLocaleDateString(navigator.language, { month: 'short', day: 'numeric' });
    }
    // 'full'
    return date.toLocaleDateString(navigator.language, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
