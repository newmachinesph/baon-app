# Baon

![License: MIT](https://img.shields.io/badge/license-MIT-green) ![Expo](https://img.shields.io/badge/Expo-57-000020) ![React Native](https://img.shields.io/badge/React%20Native-0.86-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)

A Philippines "daily basic rewards" demo app — play a quick daily game, earn points, and exchange them for load, data, and vouchers.

*Baon* is the Filipino word for the small daily allowance a parent gives a child for the day (for food or fare). The app carries that idea: a little something, every day. Its tagline is *"Konting baon, araw-araw."*

## What it is / what it is not

Baon is a **closed-loop, sponsor-funded rewards** demo. Sponsors fund a pool of points; users earn points by playing and redeem them for sponsor goods (mobile load, data, grocery and food vouchers).

- **Not a wallet.** There is no stored cash balance — only points.
- **Not crypto.** No tokens, no chain, no exchange rate to any currency market.
- **No cash-out.** Points convert to sponsor rewards only, never back to money.

This is a **frontend-only** build. All data is in-memory mock data under `src/data/`; the app makes **no `fetch` calls**. The only network access is remote image URIs (see [Images](#images)).

## The core loop

1. **Play** a daily game on the Play tab (up to 3 plays/day).
2. **Earn** points from the game.
3. **Stack** them in the Wallet.
4. **Exchange** points for load / data / groceries / food / vouchers.
5. **Streak** — claim your daily Baon each day to keep the streak alive.

## Quick start

Requires Node and the Expo tooling. Install and start:

```bash
npm install
npx expo start
```

From the Expo dev server, press `i` for the iOS simulator, `a` for an Android emulator, or `w` to open in the browser. Scanning the QR code with **Expo Go** works — the app uses no custom native modules.

## Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `start` | `expo start` | Start the Metro dev server |
| `android` | `expo start --android` | Start and open on Android |
| `ios` | `expo start --ios` | Start and open on iOS |
| `web` | `expo start --web` | Start and open in the browser |
| `lint` | `expo lint` | Run ESLint (eslint-config-expo) |
| `typecheck` | `tsc --noEmit` | Type-check the project (strict) |
| `test` | `jest` | Run the Jest test suite |
| `test:watch` | `jest --watch` | Jest in watch mode |
| `test:coverage` | `jest --coverage` | Jest with coverage report |
| `reset-project` | `node ./scripts/reset-project.js` | Reset to a blank starter (template helper) |

## Project structure

```
src/
├── app/            Expo Router routes (file-based, typed)
├── components/     Presentational UI (Card, Pill, RewardCard, GameCard, ...)
├── context/        BaonProvider — the single in-memory app store
├── data/           Mock data + the economy constants (the "backend")
├── hooks/          use-relative-date, use-countdown
├── theme/          Design tokens (colors, spacing, radius, shadow, type, sizes)
└── types.ts        Shared domain types (User, Reward, Transaction, ...)
assets/             Icons, splash, and the one bundled sponsor logo (Smart)
```

## Route map

Derived from the files in `src/app`.

| Route | File | Notes |
| --- | --- | --- |
| `/` | `index.tsx` | Splash → redirects to onboarding |
| `/onboarding` | `onboarding.tsx` | Intro |
| `/auth/welcome` | `auth/welcome.tsx` | Auth entry |
| `/auth/phone` | `auth/phone.tsx` | Enter mobile number |
| `/auth/otp` | `auth/otp.tsx` | OTP entry (mock — any 6 digits) |
| `/auth/egov` | `auth/egov.tsx` | Simulated eGovPH verification |
| `/auth/verify` | `auth/verify.tsx` | Verification result |
| `/(tabs)` | `(tabs)/_layout.tsx` | Tab bar (Play raised center) |
| `/(tabs)` → Today | `(tabs)/index.tsx` | Daily claim, streak |
| `/(tabs)/wallet` | `(tabs)/wallet.tsx` | Balance + transactions |
| `/(tabs)/play` | `(tabs)/play.tsx` | Game grid + leaderboard preview |
| `/(tabs)/exchange` | `(tabs)/exchange.tsx` | Reward catalog |
| `/(tabs)/profile` | `(tabs)/profile.tsx` | User + entry to modals |
| `/game/[id]` | `game/[id].tsx` | Play a game |
| `/game/result` | `game/result.tsx` | Result (modal) |
| `/reward/[id]` | `reward/[id].tsx` | Reward detail |
| `/redeem/[id]` | `redeem/[id].tsx` | Redeem flow (modal) |
| `/tx/[id]` | `tx/[id].tsx` | Transaction detail |
| `/notifications` | `notifications.tsx` | Notifications (modal) |
| `/referral` | `referral.tsx` | Referral code (modal) |
| `/identity` | `identity.tsx` | Identity (modal) |
| `/settings` | `settings.tsx` | Settings (modal) |
| `/about` | `about.tsx` | About (modal) |

## Mock data & the economy

The whole economy hangs off one constant in `src/data/constants.ts`:

```ts
export const POINTS_PER_PESO = 100; // 100 Baon points = PHP 1
```

Every reward satisfies `pointCost === pesoValue * POINTS_PER_PESO`, and `pointsToPeso()` inverts it. `src/data/__tests__/economy.test.ts` enforces both for every reward, so a mispriced reward fails the test suite.

Seeded starting state (`constants.ts`): balance `12,480` points, streak `6` days, daily claim `150` points, and `3` plays/day. Data is exposed through one barrel — `src/data/index.ts` — and screens import from there, never from siblings.

## State

`BaonProvider` (`src/context/BaonProvider.tsx`) holds all app state in React state and exposes it via the `useBaon()` hook. Everything mutates **in memory**, so the demo feels live within a session (nothing persists across reloads). Actions:

| Action | Effect |
| --- | --- |
| `claimDaily()` | Adds the daily points, bumps the streak, logs a transaction (once/day) |
| `awardPoints(gameId, points)` | Credits a game reward + logs it |
| `redeemReward(reward)` | Checks balance/stock, deducts points, returns a `BAON-XXXX-XXXX` code |
| `consumePlay()` | Decrements plays-left for the day |
| `refresh()` | Simulated async refresh (a timed promise) |
| `markNotificationsRead()` | Marks all notifications read |
| `setVerification(method)` | Records how the user verified (`egovph` \| `mobile`) |

## Design system

Tokens live in `src/theme/index.ts`:

- **colors** — primary `#F2A81D` (gold), plus dark/soft variants, warm background/surface, teal & coral accents, semantic success/danger, and border.
- **spacing** — `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32`.
- **radius** — `card 18 · pill 999 · button 14`.
- **shadow** — `soft` and `lifted` (low elevation only; Baon reads warm and flat).
- **type** — `display · h1 · h2 · body · caption`, on the platform sans (no custom fonts loaded).
- **sizes** — fixed control heights (`pill 36 · pillLg 44`) so pills line up on a row.

**Rule:** no raw hex, font-size, or spacing values outside `src/theme`. The one sanctioned exception is the sponsor brand `tint` values in `src/data/sponsors.ts` — each is a brand's real primary color.

## Testing & checks

```bash
npm run typecheck   # tsc --noEmit, strict
npm run lint        # eslint-config-expo
npm test            # jest (jest-expo preset)
```

Two gotchas:

- **NativeWind `className` does nothing under Jest.** The class-to-style compile happens in the Metro transform, which Jest doesn't run — so `toHaveStyle` fails on a `className`-styled node. Test logic (utilities, hooks, store) in Jest; verify styling with `npx expo export --platform web` and grep the emitted CSS. (Baon styles with StyleSheet + theme tokens anyway — NativeWind is installed from the boilerplate but unused.)
- **`@testing-library/react-native` v14: `render` is async.** `await render(<Foo />)` and query via the `screen` export. There is no `extend-expect` entrypoint anymore — matchers are built in.

## Images

The app renders remote images via plain `<Image source={{ uri }} />` and never calls `fetch`. Sources (`src/data/images.ts`):

- **Sponsor logos** — Google's favicon service (`google.com/s2/favicons?domain=…`).
- **Stock photography** — `picsum.photos` with a fixed seed (deterministic).
- **Avatars** — `i.pravatar.cc`.

**Smart's logo is a bundled asset** (`assets/images/sponsors/smart.png`) because `smart.com.ph` serves an SPA catch-all instead of a favicon, so no remote favicon service can resolve it.

## Status

Frontend-only demo. Auth is mocked — **any 6-digit OTP works**, and the eGovPH verification flow is simulated. No backend, no real payments, no leaderboard screen (the leaderboard is a preview list on the Play tab only).

## License

[MIT](LICENSE). Sponsor names and logos shown in the demo are trademarks of their respective owners and are used for illustration only.
