const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Calendar-day count since the epoch in local time, for "yesterday" detection. */
function localDayIndex(d: Date): number {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * MINUTE) / DAY);
}

/** "2h ago" | "Yesterday" | "Mar 4" — plain helper, not a hook. */
export function relativeDate(iso: string): string {
  const then = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - then.getTime();

  if (diff < MINUTE) return 'Just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;

  const dayGap = localDayIndex(now) - localDayIndex(then);
  if (dayGap === 1) return 'Yesterday';

  return `${MONTHS[then.getMonth()]} ${then.getDate()}`;
}
