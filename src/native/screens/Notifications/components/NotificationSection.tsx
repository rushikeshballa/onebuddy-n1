import React from 'react'
import { StyleSheet, View } from 'react-native'
import NotificationToggle from './NotificationToggle'
import { colors, radius } from '../theme'

export interface NotificationSectionProps {
  title: string
  enabled: boolean
  onToggle: (next: boolean) => void
}

/**
 * One card per section, containing a single ON/OFF row for the whole
 * section (e.g. "Order & Delivery") rather than a row per individual
 * notification inside it.
 */
export default function NotificationSection({ title, enabled, onToggle }: NotificationSectionProps) {
  return (
    <View style={styles.card}>
      <NotificationToggle label={title} enabled={enabled} onChange={onToggle} isFirst />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassBg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.card,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 12,
  },
})
