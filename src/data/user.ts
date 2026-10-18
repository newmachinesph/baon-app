import type { User } from '@/types';
import { portrait } from '@/data/images';

/** Demo account. Joined ~8 months before the 2026-07-10 build date. */
export const user: User = {
  id: 'u_maria_santos',
  firstName: 'Maria',
  lastName: 'Santos',
  fullName: 'Maria Santos',
  initials: 'MS',
  avatarUrl: portrait(47),
  city: 'Pasay City',
  region: 'Metro Manila',
  mobile: '+63 2 8000 0000',
  joinDate: '2025-11-12T09:24:00.000Z',
  verifiedWith: 'egovph',
};
