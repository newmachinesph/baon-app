import { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components';
import { colors, radius, shadow, spacing, type as typo } from '@/theme';

const { width } = Dimensions.get('window');

type Slide = { art: number; title: string; body: string };

const SLIDES: Slide[] = [
  {
    art: require('../../assets/images/onboarding/1.png') as number,
    title: 'A little something, every day.',
    body: 'Claim your daily baon the moment you open the app. Konti man, sigurado.',
  },
  {
    art: require('../../assets/images/onboarding/2.png') as number,
    title: 'Laro, ipon, palit.',
    body: 'Play quick games, stack your Baon points, and watch your streak grow.',
  },
  {
    art: require('../../assets/images/onboarding/3.png') as number,
    title: 'Sponsor-funded. Walang bayad.',
    body: 'Our sponsors fund the points — you never load up or pay in. Exchange them for load and vouchers, never cash.',
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isLast = index === SLIDES.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const handleNext = () => {
    if (isLast) {
      router.push('/auth/welcome');
      return;
    }
    scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
  };

  return (
    <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <View style={styles.imageFrame}>
              <Image
                source={slide.art}
                style={styles.image}
                contentFit="contain"
                transition={220}
              />
            </View>
            <Animated.View entering={FadeIn.duration(400)} style={styles.copy}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View key={slide.title} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton label={isLast ? 'Get started' : 'Next'} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  slide: { paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  imageFrame: {
    width: '100%',
    borderRadius: radius.card,
    backgroundColor: colors.primarySoft,
    ...shadow.soft,
  },
  image: { width: '100%', height: 236, borderRadius: radius.card },
  copy: { marginTop: spacing.xl, alignItems: 'center' },
  title: { ...typo.h1, fontSize: 24, textAlign: 'center' },
  body: {
    ...typo.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 22,
  },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.lg },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  dotActive: { backgroundColor: colors.primary, width: 22 },
});
