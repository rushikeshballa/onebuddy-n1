import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BuddyAvatar from './BuddyAvatar';
import {
  AVATAR_COLORS,
  AVATAR_STYLES,
  type AvatarStyleId,
  useProfile,
} from '@/context/ProfileContext';
import { schemes } from '@/design/tokens';
import { useAppTheme } from '@/theme/ThemeContext';

interface EditProfileSheetProps {
  visible: boolean;
  onClose: () => void;
}

const BRAND_GREEN = '#65B200';

export default function EditProfileSheet({ visible, onClose }: EditProfileSheetProps) {
  const { scheme } = useAppTheme();
  const tokens = schemes[scheme];
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useProfile();

  const [draftName, setDraftName] = useState(profile.name);
  const [draftPhone, setDraftPhone] = useState(profile.phone);
  const [draftEmail, setDraftEmail] = useState(profile.email);
  const [draftStyle, setDraftStyle] = useState<AvatarStyleId>(profile.style);
  const [draftColor, setDraftColor] = useState(profile.color);

  // Sync draft when opened or profile changes
  useEffect(() => {
    if (visible) {
      setDraftName(profile.name);
      setDraftPhone(profile.phone);
      setDraftEmail(profile.email);
      setDraftStyle(profile.style);
      setDraftColor(profile.color);
    }
  }, [visible, profile]);

  const handleSelectStyle = (id: AvatarStyleId) => {
    setDraftStyle(id);
    updateProfile({ style: id });
  };

  const handleSelectColor = (hex: string) => {
    setDraftColor(hex);
    updateProfile({ color: hex });
  };

  const handleChangeName = (text: string) => {
    setDraftName(text);
    updateProfile({ name: text });
  };

  const handleChangePhone = (text: string) => {
    setDraftPhone(text);
    updateProfile({ phone: text });
  };

  const handleChangeEmail = (text: string) => {
    setDraftEmail(text);
    updateProfile({ email: text });
  };

  const handleClose = () => {
    updateProfile({
      name: draftName.trim() || 'User 8225',
      phone: draftPhone.trim(),
      email: draftEmail.trim(),
      style: draftStyle,
      color: draftColor,
    });
    onClose();
  };

  const currentStyleObj = AVATAR_STYLES.find((s) => s.id === draftStyle);
  const styleLabel = currentStyleObj ? `${currentStyleObj.name} style` : 'Cap style';
  const isDark = scheme === 'dark';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable style={styles.scrimPressable} onPress={handleClose} />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: isDark ? tokens.surface1 : '#F7FAF3',
              paddingBottom: insets.bottom + 24,
            },
          ]}
        >
          {/* Top Grab Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: isDark ? tokens.ink(0.2) : '#D4D8CF' }]} />
          </View>

          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: tokens.text }]}>Edit profile</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close edit profile"
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: isDark ? tokens.surface2 : '#E6ECE0' }]}
            >
              <X size={18} color={tokens.text} strokeWidth={2.4} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Live Profile Preview Card */}
            <View style={styles.previewCard}>
              <View style={styles.avatarWrap}>
                <BuddyAvatar
                  size={82}
                  styleId={draftStyle}
                  color={draftColor}
                  borderRadius={24}
                />
              </View>
              <View style={styles.previewMeta}>
                <Text style={[styles.previewName, { color: tokens.text }]}>
                  {draftName.trim() || 'User 8225'}
                </Text>
                <Text style={[styles.previewStyle, { color: isDark ? tokens.textDim : '#737C70' }]}>
                  {styleLabel}
                </Text>
              </View>
            </View>

            {/* Input: Name */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: isDark ? tokens.textDim : '#757E72' }]}>
                NAME
              </Text>
              <TextInput
                value={draftName}
                onChangeText={handleChangeName}
                placeholder="User 8225"
                placeholderTextColor={tokens.textDim}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? tokens.surface2 : '#E8EFE2',
                    color: tokens.text,
                    borderColor: 'transparent',
                  },
                ]}
              />
            </View>

            {/* Input: Phone */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: isDark ? tokens.textDim : '#757E72' }]}>
                PHONE
              </Text>
              <TextInput
                value={draftPhone}
                onChangeText={handleChangePhone}
                placeholder="7013138225"
                placeholderTextColor={tokens.textDim}
                keyboardType="phone-pad"
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? tokens.surface2 : '#E8EFE2',
                    color: tokens.text,
                    borderColor: 'transparent',
                  },
                ]}
              />
            </View>

            {/* Input: Email */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: isDark ? tokens.textDim : '#757E72' }]}>
                EMAIL
              </Text>
              <TextInput
                value={draftEmail}
                onChangeText={handleChangeEmail}
                placeholder="you@example.com"
                placeholderTextColor={tokens.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? tokens.surface2 : '#E8EFE2',
                    color: tokens.text,
                    borderColor: 'transparent',
                  },
                ]}
              />
            </View>

            {/* Avatar Style Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: isDark ? tokens.textDim : '#757E72' }]}>
                AVATAR STYLE
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.styleRow}
              >
                {AVATAR_STYLES.map((st) => {
                  const selected = st.id === draftStyle;
                  return (
                    <Pressable
                      key={st.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${st.name} avatar style`}
                      onPress={() => handleSelectStyle(st.id)}
                      style={[
                        styles.styleOption,
                        selected && styles.styleOptionSelected,
                      ]}
                    >
                      <BuddyAvatar
                        size={64}
                        styleId={st.id}
                        color={draftColor}
                        borderRadius={16}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Background Colour Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: isDark ? tokens.textDim : '#757E72' }]}>
                BACKGROUND COLOUR
              </Text>
              <View style={styles.colorGrid}>
                {AVATAR_COLORS.map((c) => {
                  const selected = c.hex.toLowerCase() === draftColor.toLowerCase();
                  return (
                    <Pressable
                      key={c.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${c.name} background color`}
                      onPress={() => handleSelectColor(c.hex)}
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: c.hex },
                        selected && styles.colorSwatchSelected,
                      ]}
                    >
                      {selected && (
                        <Check size={18} color="#15121F" strokeWidth={3} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Save Edits Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Save edits"
              onPress={handleClose}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.saveButtonText}>Save Edits</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  scrimPressable: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '88%',
    paddingTop: 10,
    paddingHorizontal: 22,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 42,
    height: 4.5,
    borderRadius: 2.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  previewMeta: {
    flex: 1,
  },
  previewName: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
  },
  previewStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
    borderWidth: 1,
  },
  section: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  styleRow: {
    gap: 12,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  styleOption: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  styleOptionSelected: {
    borderColor: BRAND_GREEN,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 2.5,
    borderColor: '#65B200',
    transform: [{ scale: 1.06 }],
  },
  saveButton: {
    backgroundColor: BRAND_GREEN,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    marginBottom: 8,
    shadowColor: BRAND_GREEN,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
