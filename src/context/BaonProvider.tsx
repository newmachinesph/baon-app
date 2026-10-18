import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  DAILY_CLAIM_POINTS,
  MAX_PLAYS_PER_DAY,
  SEED_BALANCE,
  SEED_STREAK,
  games,
  seedNotifications,
  seedTransactions,
  user as seedUser,
} from '@/data';
import type {
  BaonContextValue,
  Game,
  Notification,
  RedeemResult,
  Reward,
  Transaction,
  User,
  VerificationMethod,
} from '@/types';

const HYDRATE_MS = 700;
const REFRESH_MS = 900;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 — reads cleanly

// Module-level counter so live transaction IDs never collide (Date.now() can).
let txCounter = 0;
const nextTxId = (): string => `tx-live-${(txCounter += 1)}`;

function randomGroup(): string {
  let out = '';
  for (let i = 0; i < 4; i += 1) {
    out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return out;
}

/** e.g. "BAON-7K3D-9F2A" */
function generateCode(): string {
  return `BAON-${randomGroup()}-${randomGroup()}`;
}

const BaonContext = createContext<BaonContextValue | null>(null);

export function BaonProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User>(seedUser);
  const [balance, setBalance] = useState(SEED_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [streak, setStreak] = useState(SEED_STREAK);
  const [todayClaimed, setTodayClaimed] = useState(false);
  const [playsLeft, setPlaysLeft] = useState(MAX_PLAYS_PER_DAY);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setHydrating(false), HYDRATE_MS);
    return () => clearTimeout(id);
  }, []);

  const claimDaily = useCallback((): number => {
    if (todayClaimed) return 0;
    const tx: Transaction = {
      id: nextTxId(),
      kind: 'claim',
      title: 'Daily Baon claimed',
      subtitle: 'Baon mo for today!',
      amount: DAILY_CLAIM_POINTS,
      date: new Date().toISOString(),
      icon: 'sunny',
    };
    setBalance((b) => b + DAILY_CLAIM_POINTS);
    setStreak((s) => s + 1);
    setTodayClaimed(true);
    setTransactions((prev) => [tx, ...prev]);
    return DAILY_CLAIM_POINTS;
  }, [todayClaimed]);

  const awardPoints = useCallback((gameId: Game['id'], points: number): void => {
    const game = games.find((g) => g.id === gameId);
    const tx: Transaction = {
      id: nextTxId(),
      kind: 'game',
      title: game ? game.title : 'Game reward',
      subtitle: 'Panalo! Points added',
      amount: points,
      date: new Date().toISOString(),
      icon: game ? game.icon : 'game-controller',
    };
    setBalance((b) => b + points);
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const consumePlay = useCallback((): void => {
    setPlaysLeft((p) => Math.max(0, p - 1));
  }, []);

  const redeemReward = useCallback(
    (reward: Reward): RedeemResult => {
      if (balance < reward.pointCost) return { ok: false, reason: 'insufficient' };
      if (reward.stock <= 0) return { ok: false, reason: 'out-of-stock' };

      const code = generateCode();
      const transactionId = nextTxId();
      const tx: Transaction = {
        id: transactionId,
        kind: 'redeem',
        title: reward.title,
        subtitle: 'Redeemed — show this code',
        amount: -reward.pointCost,
        date: new Date().toISOString(),
        icon: 'pricetag',
        code,
        sponsorId: reward.sponsorId,
      };
      setBalance((b) => b - reward.pointCost);
      setTransactions((prev) => [tx, ...prev]);
      return { ok: true, code, transactionId };
    },
    [balance],
  );

  const markNotificationsRead = useCallback((): void => {
    setNotifications((prev) => prev.map((n) => (n.read ? n : { ...n, read: true })));
  }, []);

  const refresh = useCallback((): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, REFRESH_MS));
  }, []);

  const setVerification = useCallback((method: VerificationMethod): void => {
    setUser((u) => ({ ...u, verifiedWith: method }));
  }, []);

  const value = useMemo<BaonContextValue>(
    () => ({
      user,
      balance,
      transactions,
      streak,
      todayClaimed,
      playsLeft,
      notifications,
      hydrating,
      claimDaily,
      awardPoints,
      redeemReward,
      consumePlay,
      markNotificationsRead,
      refresh,
      setVerification,
    }),
    [
      user,
      balance,
      transactions,
      streak,
      todayClaimed,
      playsLeft,
      notifications,
      hydrating,
      claimDaily,
      awardPoints,
      redeemReward,
      consumePlay,
      markNotificationsRead,
      refresh,
      setVerification,
    ],
  );

  return <BaonContext.Provider value={value}>{children}</BaonContext.Provider>;
}

export function useBaon(): BaonContextValue {
  const ctx = useContext(BaonContext);
  if (ctx === null) {
    throw new Error('useBaon must be used within a <BaonProvider>.');
  }
  return ctx;
}
