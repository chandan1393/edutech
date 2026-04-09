import { Injectable } from '@angular/core';

/**
 * TimezoneService
 * 
 * All timestamps from the backend are UTC ISO-8601 strings ("2025-06-15T14:30:00.000Z").
 * Angular's DatePipe automatically formats them in the browser's LOCAL timezone.
 * This service provides utility methods for timezone-aware display.
 */
@Injectable({ providedIn: 'root' })
export class TimezoneService {

  /** Browser's timezone name (e.g. "America/New_York", "Asia/Kolkata") */
  userTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /** Short timezone label for display (e.g. "EST", "IST") */
  userTimezoneLabel(): string {
    return new Intl.DateTimeFormat('en', { timeZoneName: 'short' })
      .formatToParts(new Date())
      .find(p => p.type === 'timeZoneName')?.value || '';
  }

  /** UTC offset string (e.g. "UTC+5:30", "UTC-5") */
  userUtcOffset(): string {
    const offset = -new Date().getTimezoneOffset();
    const sign   = offset >= 0 ? '+' : '-';
    const abs    = Math.abs(offset);
    const h      = Math.floor(abs / 60).toString().padStart(2, '0');
    const m      = (abs % 60).toString().padStart(2, '0');
    return m === '00' ? `UTC${sign}${parseInt(h)}` : `UTC${sign}${parseInt(h)}:${m}`;
  }

  /**
   * Format a UTC ISO string for display in user's local timezone.
   * Uses Intl.DateTimeFormat which respects the browser's locale and timezone.
   */
  formatLocal(isoString: string, opts?: Intl.DateTimeFormatOptions): string {
    if (!isoString) return '';
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
      ...opts
    }).format(d);
  }

  /** Format date-only (no time) — LocalDate fields like dueDate, classStartDate */
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    // LocalDate is "YYYY-MM-DD" — parse as local date to avoid timezone shift
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d); // local midnight
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(date);
  }

  /** How many days until a LocalDate due date (date-only, no timezone) */
  daysUntil(dateStr: string): number {
    if (!dateStr) return 0;
    const [y, m, d] = dateStr.split('-').map(Number);
    const due = new Date(y, m - 1, d);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
  }

  /** Returns true if the date-string represents today or in the past */
  isOverdue(dateStr: string): boolean {
    return this.daysUntil(dateStr) < 0;
  }

  isToday(dateStr: string): boolean {
    return this.daysUntil(dateStr) === 0;
  }
}
