import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow, spacing, type as typo } from '@/theme';
import type { IconName } from '@/types';

/** BottomTabBarProps, sourced from Tabs' own tabBar prop — no deep react-navigation import. */
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

type TabConfig = { label: string; icon: IconName; iconActive: IconName; center?: boolean };

/** Display order = key order here. Play sits dead-center as the raised button. */
const TABS: Record<string, TabConfig> = {
  index: { label: 'Today', icon: 'sunny-outline', iconActive: 'sunny' },
  wallet: { label: 'Wallet', icon: 'wallet-outline', iconActive: 'wallet' },
  play: { label: 'Play', icon: 'game-controller', iconActive: 'game-controller', center: true },
  exchange: { label: 'Exchange', icon: 'gift-outline', iconActive: 'gift' },
  profile: { label: 'Profile', icon: 'person-outline', iconActive: 'person' },
};

const GOLD = [colors.primary, colors.primaryDark] as const;
const BAR_HEIGHT = 62;

function StandardTab({
  cfg,
  focused,
  onPress,
}: {
  cfg: TabConfig;
  focused: boolean;
  onPress: () => void;
}) {
  const tint = focused ? colors.primary : colors.textSecondary;
  return (
    <Pressable style={styles.cell} onPress={onPress} hitSlop={6}>
      <Ionicons name={focused ? cfg.iconActive : cfg.icon} size={22} color={tint} />
      <Text style={[typo.caption, styles.label, { color: tint }]}>{cfg.label}</Text>
    </Pressable>
  );
}

function CenterTab({
  cfg,
  focused,
  onPress,
}: {
  cfg: TabConfig;
  focused: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.cell} onPress={onPress} hitSlop={6}>
      <LinearGradient
        colors={GOLD}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerButton}
      >
        <Ionicons name={cfg.iconActive} size={28} color={colors.surface} />
      </LinearGradient>
      <Text
        style={[typo.caption, styles.label, { color: focused ? colors.primaryDark : colors.textSecondary }]}
      >
        {cfg.label}
      </Text>
    </Pressable>
  );
}

function BaonTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { height: BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const cfg = TABS[route.name];
        if (!cfg) return null;

        const focused = state.index === index;
        const onPress = () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        return cfg.center ? (
          <CenterTab key={route.key} cfg={cfg} focused={focused} onPress={onPress} />
        ) : (
          <StandardTab key={route.key} cfg={cfg} focused={focused} onPress={onPress} />
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BaonTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="play" />
      <Tabs.Screen name="exchange" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
  },
  label: { fontWeight: '600', fontSize: 11 },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.surface,
    ...shadow.lifted,
  },
});
