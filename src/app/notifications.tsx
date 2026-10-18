import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, EmptyState, Screen } from '@/components';
import { useBaon } from '@/context/BaonProvider';
import { relativeDate } from '@/hooks/use-relative-date';
import { colors, radius, spacing, type as typo } from '@/theme';

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

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markNotificationsRead } = useBaon();
  // Snapshot at mount so unread dots stay visible even after we clear the badge.
  const [items] = useState(notifications);

  useEffect(() => {
    markNotificationsRead();
  }, [markNotificationsRead]);

  return (
    <Screen scroll>
      <Header title="Notifications" onBack={() => router.back()} />

      {items.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="All caught up"
          body="No notifications right now. Come back after you claim or play."
        />
      ) : (
        items.map((n, i) => (
          <Animated.View key={n.id} entering={FadeInDown.delay(i * 60).springify()}>
            <Card style={styles.card}>
              <View style={[styles.iconTile, !n.read && styles.iconTileUnread]}>
                <Ionicons
                  name={n.icon}
                  size={20}
                  color={n.read ? colors.textSecondary : colors.primaryDark}
                />
              </View>
              <View style={styles.body}>
                <View style={styles.titleRow}>
                  <Text style={[typo.body, styles.title]} numberOfLines={1}>
                    {n.title}
                  </Text>
                  {!n.read ? <View style={styles.dot} /> : null}
                </View>
                <Text style={[typo.caption, styles.text]} numberOfLines={2}>
                  {n.body}
                </Text>
                <Text style={[typo.caption, styles.date]}>{relativeDate(n.date)}</Text>
              </View>
            </Card>
          </Animated.View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, marginBottom: spacing.sm },
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
  card: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  iconTileUnread: { backgroundColor: colors.primarySoft },
  body: { flex: 1, marginLeft: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontWeight: '700', flex: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentCoral,
    marginLeft: spacing.sm,
  },
  text: { marginTop: 2, lineHeight: 18 },
  date: { marginTop: spacing.xs, color: colors.textSecondary },
});
