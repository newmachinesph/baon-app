import { cn } from '@/lib/cn';

test('cn merges conflicting tailwind classes, last wins', () => {
  expect(cn('p-2', 'p-4')).toBe('p-4');
});

test('cn drops falsy values', () => {
  expect(cn('p-2', false && 'hidden', undefined)).toBe('p-2');
});
