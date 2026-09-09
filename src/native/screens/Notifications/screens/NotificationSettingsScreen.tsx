import React, { useState } from 'react'
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import NotificationCategories from '../components/NotificationCategories'
import NotificationSection from '../components/NotificationSection'
import { CATEGORY_TABS, NOTIFICATION_DATA, buildDefaultNotificationState } from '../notificationData'
import { colors } from '../theme'
import type { CategoryId } from '../types'

export interface NotificationSettingsScreenProps {
  onBack: () => void
}

/**
 * Full-screen Notification Settings — section-level version. Each
 * section (e.g. "Order & Delivery") is a single ON/OFF row instead of
 * a list of individual notifications, but everything else (header,
 * category tabs, card styling, per-category independent state) is
 * unchanged from the full version.
 */
export default function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('food')
  const [notifications, setNotifications] = useState(buildDefaultNotificationState)

  function handleToggle(categoryId: CategoryId, key: string, next: boolean) {
    setNotifications((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [key]: next },
    }))
  }

  const category = NOTIFICATION_DATA[activeCategory]
  const categoryValues = notifications[activeCategory] || {}

  return (
    <SafeAreaView style={styles.page} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack} accessibilityRole="button" accessibilityLabel="Back">
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <View style={styles.heading}>
          <Text style={styles.title}>Notification Settings</Text>
          <Text style={styles.sub}>Choose which notifications you want to receive</Text>
        </View>
      </View>

      <NotificationCategories categories={CATEGORY_TABS} activeId={activeCategory} onSelect={setActiveCategory} />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.categoryHeading}>{category.title}</Text>
        {category.sections.map((section) => (
          <NotificationSection
            key={section.key}
            title={section.title}
            enabled={!!categoryValues[section.key]}
            onToggle={(next) => handleToggle(activeCategory, section.key, next)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgDeep },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.rowDivider,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 2,
  },
  backArrow: { color: colors.mistDim, fontSize: 20, lineHeight: 20, marginTop: -2 },
  backText: { color: colors.mistDim, fontSize: 13.5, fontWeight: '500' },
  heading: { flex: 1 },
  title: { fontSize: 19, fontWeight: '700', color: colors.mist },
  sub: { fontSize: 13, color: colors.mistDim, marginTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 },
  categoryHeading: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: colors.goldLight,
    marginBottom: 14,
    marginLeft: 2,
  },
})
