import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';

interface FloatingCartBarProps {
  onPress: () => void;
  bottomOffset?: number;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  onPress,
  bottomOffset = 12,
}) => {
  const { cartItems, getCartCount, getCartTotal, getPriceSummary } = useCart();
  const cartCount = getCartCount();
  const totalAmount = getCartTotal();
  const priceSummary = getPriceSummary();

  if (cartCount === 0 || cartItems.length === 0) {
    return null;
  }

  // Pick up to 3 distinct product images for visual preview
  const previewItems = cartItems.slice(0, 3);
  const extraItemsCount = cartItems.length - 3;
  const savings = priceSummary.discount;

  return (
    <View style={[styles.outerContainer, { bottom: bottomOffset }]}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Left Section: Item Preview & Price */}
        <View style={styles.leftSection}>
          {/* Thumbnails Stack */}
          <View style={styles.imagesStack}>
            {previewItems.map((item, idx) => (
              <Image
                key={item.product.id || idx}
                source={{ uri: item.product.image }}
                style={[
                  styles.thumbImage,
                  { marginLeft: idx === 0 ? 0 : -10, zIndex: 10 - idx },
                ]}
              />
            ))}
            {extraItemsCount > 0 && (
              <View style={[styles.extraBadge, { marginLeft: -10, zIndex: 5 }]}>
                <Text style={styles.extraBadgeText}>+{extraItemsCount}</Text>
              </View>
            )}
          </View>

          {/* Item details */}
          <View style={styles.infoCol}>
            <View style={styles.countAndPriceRow}>
              <Text style={styles.itemCountText}>
                {cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'}
              </Text>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.priceText}>{formatCurrency(totalAmount)}</Text>
            </View>
            {savings > 0 ? (
              <Text style={styles.savingsText}>
                Saved {formatCurrency(savings)} 🎉
              </Text>
            ) : (
              <Text style={styles.deliverySubtext}>Express 15-min delivery</Text>
            )}
          </View>
        </View>

        {/* Right Section: View Cart Button */}
        <View style={styles.rightSection}>
          <Text style={styles.viewCartText}>View Cart</Text>
          <View style={styles.cartIconCircle}>
            <Ionicons name="cart" size={16} color={colors.primary} />
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  imagesStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  extraBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  infoCol: {
    justifyContent: 'center',
  },
  countAndPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  itemCountText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  bulletDot: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  priceText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  savingsText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: typography.weights.semibold,
  },
  deliverySubtext: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: spacing.borderRadius.round,
    gap: 6,
  },
  viewCartText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  cartIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
