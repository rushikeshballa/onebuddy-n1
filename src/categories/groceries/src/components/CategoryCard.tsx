import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types/category.types';
import { colors, typography, spacing } from '../theme';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  variant?: 'grid' | 'compact' | 'home';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  variant = 'home',
}) => {
  const [imageError, setImageError] = useState(false);

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[
          styles.compactContainer,
          { backgroundColor: category.backgroundColor || colors.primaryLight },
        ]}
        onPress={() => onPress(category)}
        activeOpacity={0.8}
      >
        {imageError || !category.image ? (
          <Ionicons
            name={(category.icon as any) || 'bag-handle-outline'}
            size={18}
            color={colors.primary}
          />
        ) : (
          <Image
            source={{ uri: category.image }}
            style={styles.compactImage}
            onError={() => setImageError(true)}
          />
        )}
        <Text style={styles.compactText} numberOfLines={1}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(category)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.imageWrapper,
          { backgroundColor: category.backgroundColor || colors.primaryLight },
        ]}
      >
        {imageError || !category.image ? (
          <Ionicons
            name={(category.icon as any) || 'bag-handle-outline'}
            size={28}
            color={colors.primary}
          />
        ) : (
          <Image
            source={{ uri: category.image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    width: 82,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 14,
    height: 28,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: spacing.borderRadius.round,
    marginRight: spacing.sm,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  compactImage: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  compactText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
});
