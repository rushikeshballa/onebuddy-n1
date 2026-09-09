import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const baseStyle: ViewStyle = styles.container;
    const variantStyle = styles[`variant_${variant}` as keyof typeof styles] as ViewStyle;
    const sizeStyle = styles[`size_${size}` as keyof typeof styles] as ViewStyle;
    const disabledStyle = disabled ? styles.disabledContainer : {};

    return [baseStyle, variantStyle, sizeStyle, disabledStyle, style as ViewStyle];
  };

  const getTextStyle = (): TextStyle[] => {
    const baseTextStyle: TextStyle = styles.text;
    const variantTextStyle = styles[`text_${variant}` as keyof typeof styles] as TextStyle;
    const sizeTextStyle = styles[`textSize_${size}` as keyof typeof styles] as TextStyle;

    return [baseTextStyle, variantTextStyle, sizeTextStyle, textStyle as TextStyle];
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.borderRadius.md,
    gap: spacing.xs,
  },
  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_secondary: {
    backgroundColor: colors.secondary,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_text: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: colors.danger,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  size_small: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  size_medium: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  size_large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  text: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.white,
  },
  text_outline: {
    color: colors.primary,
  },
  text_text: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.white,
  },
  textSize_small: {
    fontSize: typography.sizes.sm,
  },
  textSize_medium: {
    fontSize: typography.sizes.md,
  },
  textSize_large: {
    fontSize: typography.sizes.lg,
  },
});
