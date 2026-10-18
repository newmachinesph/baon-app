import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Coin, EmptyState } from '@/components';
import { triviaQuestions } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';

const TRIVIA_COUNT = 5;
const CORRECT_PTS = 60;
const PERFECT_BONUS = 20;
const TAP_DURATION = 10;
const TAP_PER_HIT = 8;
const TAP_CAP = 320;
const COIN_SIZE = 64;

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </Pressable>
      <Text style={[typo.h1, styles.headerTitle]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

type ChoiceState = 'idle' | 'correct' | 'wrong';

function TriviaGame({ onFinish }: { onFinish: (points: number, correct: number) => void }) {
  const questions = useMemo(() => triviaQuestions.slice(0, TRIVIA_COUNT), []);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const correctRef = useRef(0);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  const q = questions[qIndex];
  const answered = picked !== null;
  const progress = (qIndex + (answered ? 1 : 0)) / TRIVIA_COUNT;

  const choose = (i: number): void => {
    if (answered) return;
    setPicked(i);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const right = i === q.answerIndex;
    if (right) correctRef.current += 1;
    void Haptics.notificationAsync(
      right ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
    );
    setTimeout(() => {
      if (qIndex + 1 < TRIVIA_COUNT) {
        setPicked(null);
        setQIndex((n) => n + 1);
      } else {
        const correct = correctRef.current;
        const points = correct * CORRECT_PTS + (correct === TRIVIA_COUNT ? PERFECT_BONUS : 0);
        finishRef.current(points, correct);
      }
    }, 700);
  };

  const stateFor = (i: number): ChoiceState => {
    if (!answered) return 'idle';
    if (i === q.answerIndex) return 'correct';
    if (i === picked) return 'wrong';
    return 'idle';
  };

  return (
    <View style={styles.body}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={[typo.caption, styles.counter]}>
        Question {qIndex + 1} of {TRIVIA_COUNT}
      </Text>

      <Animated.Text key={q.id} entering={FadeInDown.springify()} style={[typo.h1, styles.prompt]}>
        {q.prompt}
      </Animated.Text>

      <View style={styles.choices}>
        {q.choices.map((choice, i) => {
          const cs = stateFor(i);
          return (
            <Pressable
              key={i}
              onPress={() => choose(i)}
              disabled={answered}
              style={[
                styles.choice,
                cs === 'correct' && styles.choiceCorrect,
                cs === 'wrong' && styles.choiceWrong,
              ]}
            >
              <Text
                style={[
                  typo.body,
                  styles.choiceText,
                  (cs === 'correct' || cs === 'wrong') && styles.choiceTextOn,
                ]}
              >
                {choice}
              </Text>
              {cs === 'correct' ? (
                <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
              ) : cs === 'wrong' ? (
                <Ionicons name="close-circle" size={20} color={colors.surface} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TapGame({ onFinish }: { onFinish: (points: number) => void }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TAP_DURATION);
  const [pos, setPos] = useState({ x: 0.5, y: 0.4 });
  const [area, setArea] = useState({ w: 0, h: 0 });
  const tapsRef = useRef(0);
  const doneRef = useRef(false);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => {
      const remaining = Math.max(0, TAP_DURATION - (Date.now() - started) / 1000);
      setTimeLeft(remaining);
      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(id);
        finishRef.current(Math.min(TAP_CAP, tapsRef.current * TAP_PER_HIT));
      }
    }, 80);
    return () => clearInterval(id);
  }, []);

  const tapCoin = (): void => {
    if (doneRef.current) return;
    tapsRef.current += 1;
    setTaps(tapsRef.current);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPos({ x: 0.08 + Math.random() * 0.84, y: 0.08 + Math.random() * 0.84 });
  };

  const points = Math.min(TAP_CAP, taps * TAP_PER_HIT);
  const left = Math.max(0, area.w * pos.x - COIN_SIZE / 2);
  const top = Math.max(0, area.h * pos.y - COIN_SIZE / 2);

  return (
    <View style={styles.body}>
      <View style={styles.tapStats}>
        <View>
          <Text style={[typo.caption, styles.tapLabel]}>Taps</Text>
          <Text style={styles.tapValue}>{taps}</Text>
        </View>
        <View style={styles.tapPoints}>
          <Coin size={22} />
          <Text style={styles.tapPointsText}>{points}</Text>
        </View>
        <View>
          <Text style={[typo.caption, styles.tapLabel]}>Time</Text>
          <Text style={styles.tapValue}>{Math.ceil(timeLeft)}s</Text>
        </View>
      </View>

      <View style={styles.timerTrack}>
        <View style={[styles.timerFill, { width: `${(timeLeft / TAP_DURATION) * 100}%` }]} />
      </View>

      <View
        style={styles.playArea}
        onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <Pressable onPress={tapCoin} style={[styles.coinTarget, { left, top }]}>
          <Coin size={COIN_SIZE} />
        </Pressable>
      </View>

      <Text style={[typo.caption, styles.tapHint]}>Tap the coin — bilisan mo!</Text>
    </View>
  );
}

export default function GameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { playsLeft, consumePlay, awardPoints } = useBaon();

  const finishTrivia = (points: number, correct: number): void => {
    consumePlay();
    awardPoints('trivia', points);
    router.replace({
      pathname: '/game/result',
      params: { points: String(points), correct: String(correct), total: '5', gameId: 'trivia' },
    });
  };

  const finishTap = (points: number): void => {
    consumePlay();
    awardPoints('tap', points);
    router.replace({
      pathname: '/game/result',
      params: { points: String(points), gameId: 'tap' },
    });
  };

  const title = id === 'trivia' ? 'Baon Trivia' : id === 'tap' ? 'Tap Rush' : 'Game';

  let content: React.ReactNode;
  if (playsLeft <= 0) {
    content = (
      <EmptyState
        icon="time-outline"
        title="No plays left today"
        body="You've used all 3 plays. Bumalik ka bukas for more baon!"
        actionLabel="Back to Play"
        onAction={() => router.replace('/(tabs)/play')}
      />
    );
  } else if (id === 'trivia') {
    content = <TriviaGame onFinish={finishTrivia} />;
  } else if (id === 'tap') {
    content = <TapGame onFinish={finishTap} />;
  } else {
    content = (
      <EmptyState
        icon="game-controller-outline"
        title="Coming soon"
        body="This game isn't ready yet. Try Baon Trivia or Tap Rush to earn today."
        actionLabel="Back to Play"
        onAction={() => router.replace('/(tabs)/play')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
      <View style={styles.headerPad}>
        <Header title={title} onBack={() => router.back()} />
      </View>
      <Animated.View entering={FadeIn} style={styles.flex}>
        {content}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  headerPad: { paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: { marginLeft: spacing.md, flex: 1 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.accentTeal },
  counter: { marginTop: spacing.sm },
  prompt: { marginTop: spacing.lg, fontSize: 22, lineHeight: 30 },
  choices: { marginTop: spacing.xl },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  choiceCorrect: { backgroundColor: colors.success, borderColor: colors.success },
  choiceWrong: { backgroundColor: colors.danger, borderColor: colors.danger },
  choiceText: { fontWeight: '600', flex: 1 },
  choiceTextOn: { color: colors.surface },

  tapStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tapLabel: { textTransform: 'uppercase', letterSpacing: 1 },
  tapValue: { ...typo.h1, color: colors.textPrimary },
  tapPoints: { flexDirection: 'row', alignItems: 'center' },
  tapPointsText: { ...typo.display, marginLeft: spacing.sm, color: colors.primaryDark },
  timerTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  timerFill: { height: 8, borderRadius: radius.pill, backgroundColor: colors.accentCoral },
  playArea: {
    flex: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  coinTarget: { position: 'absolute' },
  tapHint: { textAlign: 'center', marginBottom: spacing.md },
});
