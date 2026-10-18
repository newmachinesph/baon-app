import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { BalancePill, EmptyState, Pill, RewardCard, Screen } from '@/components';
import { rewardCategories, rewards, sponsors } from '@/data';
import { useBaon } from '@/context/BaonProvider';
import { colors, radius, spacing, type as typo } from '@/theme';
import type { RewardCategory } from '@/types';

type CategoryFilter = RewardCategory | 'all';

export default function ExchangeScreen() {
  const router = useRouter();
  const { balance } = useBaon();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rewards.filter((reward) => {
      if (category !== 'all' && reward.category !== category) return false;
      if (!q) return true;
      const sponsorName = sponsors[reward.sponsorId].name.toLowerCase();
      return reward.title.toLowerCase().includes(q) || sponsorName.includes(q);
    });
  }, [query, category]);

  return (
    <Screen scroll={false} padded={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={typo.display}>Exchange</Text>
            <Text style={[typo.caption, styles.subtitle]}>Turn baon into load, data &amp; more</Text>
          </View>
          <BalancePill points={balance} onPress={() => router.push('/wallet')} />
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rewards or sponsors"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 ? (
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textSecondary}
              onPress={() => setQuery('')}
              suppressHighlighting
            />
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Pill
            label="All"
            tone="gold"
            selected={category === 'all'}
            onPress={() => setCategory('all')}
          />
          {rewardCategories.map((cat) => (
            <Pill
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              tone="gold"
              selected={category === cat.id}
              onPress={() => setCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {results.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="Walang nahanap"
            body="No rewards match your search. Try another keyword or category."
            actionLabel="Clear filters"
            onAction={() => {
              setQuery('');
              setCategory('all');
            }}
          />
        ) : (
          <View style={styles.grid}>
            {results.map((reward, i) => (
              <Animated.View
                key={reward.id}
                entering={FadeInDown.delay(Math.min(i, 10) * 45).springify()}
                style={styles.gridItem}
              >
                <RewardCard
                  reward={reward}
                  affordable={balance >= reward.pointCost}
                  onPress={() => router.push(`/reward/${reward.id}`)}
                />
              </Animated.View>
            ))}
          </View>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitle: { marginTop: 2 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingRight: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: { width: '48.5%', marginBottom: spacing.md },
  bottomSpacer: { height: spacing.xxl },
});
