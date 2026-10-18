import type { LeaderboardEntry } from '@/types';
import { portrait } from '@/data/images';

/** Maria sits at rank 4 with exactly her seed balance. Points strictly descending. */
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Ramon dela Cruz', avatarUrl: portrait(12), points: 18420, isYou: false },
  { rank: 2, name: 'Liza Reyes', avatarUrl: portrait(5), points: 16110, isYou: false },
  { rank: 3, name: 'Kevin Tan', avatarUrl: portrait(33), points: 14250, isYou: false },
  { rank: 4, name: 'Maria Santos', avatarUrl: portrait(47), points: 12480, isYou: true },
  { rank: 5, name: 'Jomar Aquino', avatarUrl: portrait(15), points: 11200, isYou: false },
  { rank: 6, name: 'Nena Bautista', avatarUrl: portrait(45), points: 9870, isYou: false },
  { rank: 7, name: 'Paolo Villanueva', avatarUrl: portrait(52), points: 8640, isYou: false },
  { rank: 8, name: 'Grace Mendoza', avatarUrl: portrait(9), points: 7510, isYou: false },
];
