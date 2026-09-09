import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../theme'

const TRACK_W = 46
const TRACK_H = 26
const KNOB = 20
const KNOB_TRAVEL = TRACK_W - KNOB - 4 // 2px inset each side

export interface NotificationToggleProps {
  label: string
  enabled: boolean
  onChange: (next: boolean) => void
  isFirst?: boolean
}

/**
 * role="switch" equivalent for native: accessibilityRole="switch" plus
 * accessibilityState.checked gives screen readers (VoiceOver/TalkBack)
 * the same semantics the web version gets from role="switch".
 */
export default function NotificationToggle({ label, enabled, onChange, isFirst }: NotificationToggleProps) {
  const anim = useRef(new Animated.Value(enabled ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: enabled ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start()
  }, [enabled, anim])

  const knobTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [0, KNOB_TRAVEL] })

  return (
    <View style={[styles.row, isFirst && styles.rowFirst]}>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
      <Pressable
        onPress={() => onChange(!enabled)}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
        accessibilityLabel={label}
        hitSlop={8}
      >
        {enabled ? (
          <LinearGradient
            colors={[colors.goldLight, colors.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.track}
          >
            <Animated.View
              style={[styles.knob, { backgroundColor: colors.ink, transform: [{ translateX: knobTranslate }] }]}
            />
          </LinearGradient>
        ) : (
          <View style={[styles.track, styles.trackOff]}>
            <Animated.View
              style={[styles.knob, { backgroundColor: colors.mist, transform: [{ translateX: knobTranslate }] }]}
            />
          </View>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.rowDivider,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  label: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 20,
    color: colors.mist,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  trackOff: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    marginLeft: 2,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
})
