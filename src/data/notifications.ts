import type { Notification } from '@/types';

/** 6 seed notifications, unread first. Dates anchored to the 2026-07-10 build day. */
export const seedNotifications: Notification[] = [
  {
    id: 'n-daily',
    title: 'Baon mo for today!',
    body: 'Claim your 150 daily points before midnight.',
    date: '2026-07-10T06:00:00.000Z',
    icon: 'sunny',
    read: false,
  },
  {
    id: 'n-streak',
    title: "You're on a 6-day streak",
    body: 'Konti na lang para sa 7-day streak bonus.',
    date: '2026-07-09T20:00:00.000Z',
    icon: 'flame',
    read: false,
  },
  {
    id: 'n-data-drop',
    title: 'New Globe data packs',
    body: 'GoSURF50 is now redeemable for fewer points.',
    date: '2026-07-08T10:00:00.000Z',
    icon: 'wifi',
    read: false,
  },
  {
    id: 'n-trivia-reward',
    title: 'Trivia reward added',
    body: '+120 points landed in your Wallet.',
    date: '2026-07-10T08:04:00.000Z',
    icon: 'game-controller',
    read: true,
  },
  {
    id: 'n-redeem-ready',
    title: 'Redemption ready',
    body: 'Your Jollibee Chickenjoy code is waiting to be claimed.',
    date: '2026-07-05T18:46:00.000Z',
    icon: 'gift',
    read: true,
  },
  {
    id: 'n-welcome',
    title: 'Welcome to Baon!',
    body: 'Verified via eGovPH. Enjoy your daily baon.',
    date: '2025-11-12T09:30:00.000Z',
    icon: 'shield-checkmark',
    read: true,
  },
];
