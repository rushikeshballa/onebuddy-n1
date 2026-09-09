import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceSummaryData } from '../types/cart.types';
import { colors, typography, spacing } from '../theme';
import { formatCurrency } from '../utils/helpers';

interface PriceSummaryProps {
  summary: PriceSummaryData;
  showTitle?: boolean;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  summary,
  showTitle = true,
}) => {
  const { subtotal, discount, deliveryFee, tax, total, itemCount } = summary;

  return (
    <View style={styles.container}>
      {showTitle && <Text style={styles.title}>Bill Details</Text>}

      <View style={styles.row}>
        <Text style={styles.label}>Item Total ({itemCount} items)</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Product Discount</Text>
          <Text style={[styles.value, styles.discountText]}>
            -{formatCurrency(discount)}
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        {deliveryFee === 0 ? (
          <Text style={[styles.value, styles.freeText]}>FREE</Text>
        ) : (
          <Text style={styles.value}>{formatCurrency(deliveryFee)}</Text>
        )}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Taxes & Charges</Text>
        <Text style={styles.value}>{formatCurrency(tax)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>To Pay</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>

      {discount > 0 && (
        <View style={styles.savingsBanner}>
          <Text style={styles.savingsText}>
            🎉 You are saving {formatCurrency(discount)} on this order!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  discountText: {
    color: colors.success,
  },
  freeText: {
    color: colors.success,
    fontWeight: typography.weights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  savingsBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
});
