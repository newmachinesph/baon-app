import type { IconName, RewardCategory } from '@/types';

/** 100 Baon points = PHP 1. The whole economy hangs off this constant. */
export const POINTS_PER_PESO = 100;

export const pointsToPeso = (points: number): number => points / POINTS_PER_PESO;

/** "12480" -> "12,480". Manual grouping: Hermes Intl support is not guaranteed. */
export const formatPoints = (n: number): string => {
  const sign = n < 0 ? '-' : '';
  const digits = Math.abs(Math.trunc(n)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/** 124.8 -> "₱124.80". Peso sign kept as an escape so source stays ASCII. */
export const formatPeso = (n: number): string => `\u20b1${n.toFixed(2)}`;

export const SEED_BALANCE = 12480;
export const SEED_STREAK = 6;
export const DAILY_CLAIM_POINTS = 150;
export const MAX_PLAYS_PER_DAY = 3;

export const referralCode = 'MARIA-BAON-2K6';

export const rewardCategories: { id: RewardCategory; label: string; icon: IconName }[] = [
  { id: 'load', label: 'Load', icon: 'call' },
  { id: 'data', label: 'Data', icon: 'wifi' },
  { id: 'groceries', label: 'Groceries', icon: 'cart' },
  { id: 'food', label: 'Food', icon: 'fast-food' },
  { id: 'vouchers', label: 'Vouchers', icon: 'ticket' },
];
