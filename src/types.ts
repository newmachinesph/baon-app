import type { ComponentProps } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type VerificationMethod = 'egovph' | 'mobile';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  avatarUrl: string;
  city: string;
  region: string;
  mobile: string;
  joinDate: string; // ISO
  verifiedWith: VerificationMethod;
};

export type SponsorId =
  | 'globe'
  | 'smart'
  | 'dito'
  | 'jollibee'
  | 'puregold'
  | 'sevenEleven'
  | 'sm'
  | 'grab'
  | 'mcdo'
  | 'shopee';

export type Sponsor = {
  id: SponsorId;
  name: string;
  /** Remote favicon for most brands; a bundled asset where no square remote mark exists. */
  logo: ImageSourcePropType;
  tint: string;
};

export type RewardCategory = 'load' | 'data' | 'groceries' | 'food' | 'vouchers';

export type Reward = {
  id: string;
  title: string;
  subtitle: string;
  category: RewardCategory;
  /** Cost in Baon points. Must equal pesoValue * POINTS_PER_PESO. */
  pointCost: number;
  pesoValue: number;
  sponsorId: SponsorId;
  imageUrl: string;
  stock: number;
  limited: boolean;
  terms: string[];
};

export type TxKind = 'claim' | 'game' | 'redeem' | 'bonus' | 'referral';

export type Transaction = {
  id: string;
  kind: TxKind;
  title: string;
  subtitle: string;
  /** Positive = earned, negative = redeemed. Always in points. */
  amount: number;
  date: string; // ISO
  icon: IconName;
  /** Present on redeem rows. */
  code?: string;
  sponsorId?: SponsorId;
};

export type GameStatus = 'playable' | 'soon';

export type Game = {
  id: 'trivia' | 'word' | 'tap' | 'match' | 'spin' | 'guess';
  title: string;
  blurb: string;
  icon: IconName;
  tint: string;
  minReward: number;
  maxReward: number;
  status: GameStatus;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  date: string; // ISO
  icon: IconName;
  read: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  avatarUrl: string;
  points: number;
  isYou: boolean;
};

export type TriviaQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  answerIndex: number;
};

/** Result of a redeem attempt — screens branch on this, never on raw balance. */
export type RedeemResult =
  | { ok: true; code: string; transactionId: string }
  | { ok: false; reason: 'insufficient' | 'out-of-stock' };

export type BaonState = {
  user: User;
  balance: number;
  transactions: Transaction[];
  streak: number;
  todayClaimed: boolean;
  playsLeft: number;
  notifications: Notification[];
  hydrating: boolean;
};

export type BaonActions = {
  claimDaily: () => number;
  awardPoints: (gameId: Game['id'], points: number) => void;
  redeemReward: (reward: Reward) => RedeemResult;
  consumePlay: () => void;
  markNotificationsRead: () => void;
  refresh: () => Promise<void>;
  setVerification: (method: VerificationMethod) => void;
};

export type BaonContextValue = BaonState & BaonActions;
