import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ChevronLeft, Home, Building, MapPin, Edit2, Plus } from 'lucide-react-native';
import { Address, subscribeToAddresses, loadAddresses } from '../data/address';

interface SavedAddressesScreenProps {
  onBack: () => void;
  onAddAddress: () => void;
  onEditAddress: (address: Address) => void;
}

export const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({
  onBack,
  onAddAddress,
  onEditAddress,
}) => {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  useEffect(() => {
    loadAddresses();
    return subscribeToAddresses(setSavedAddresses);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backBtn}
          activeOpacity={0.5}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Saved Addresses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {savedAddresses.length > 0 ? (
            savedAddresses.map((loc) => (
              <View key={loc.id} style={styles.locItem}>
                <View style={styles.locIconContainer}>
                  {loc.label === 'Home' ? <Home size={20} color="#6B7280" /> : loc.label === 'Work' ? <Building size={20} color="#6B7280" /> : <MapPin size={20} color="#6B7280" />}
                </View>
                <View style={styles.locDetails}>
                  <Text style={styles.locName}>{loc.label}</Text>
                  <Text style={styles.locArea}>{loc.houseNo}, {loc.building ? loc.building + ', ' : ''}{loc.landmark}</Text>
                  {loc.receiverName ? <Text style={styles.receiverDetails}>{loc.receiverName} - {loc.receiverPhone}</Text> : null}
                </View>
                <TouchableOpacity
                  onPress={() => onEditAddress(loc)}
                  style={styles.editBtn}
                  activeOpacity={0.7}
                >
                  <Edit2 size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No saved addresses yet.</Text>
          )}
        </View>

        {/* Add Address Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAddAddress}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#65A30D" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  list: {
    gap: 12,
  },
  locItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  locIconContainer: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
  },
  locDetails: {
    flex: 1,
  },
  locName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  locArea: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  receiverDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  editBtn: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 32,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginTop: 12,
  },
  addBtnText: {
    color: '#65A30D',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
