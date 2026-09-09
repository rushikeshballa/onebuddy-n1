import React, { useRef } from 'react';
import { Modal, StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FoodApp, { type FoodAppRef } from '../categories/food/App';
import { colors } from '../categories/groceries/src/theme';

interface FoodHostProps {
  visible: boolean;
  onClose: () => void;
}

/**
  * FoodHost
  * Hosts the complete React Native Food sub-application from src/categories/food/native-buddy-food
  * full-screen over the OneBuddy WebView dashboard.
  */
export default function FoodHost({
  visible,
  onClose,
}: FoodHostProps): React.JSX.Element | null {
  const foodRef = useRef<FoodAppRef>(null);

  if (!visible) {
    return null;
  }

  const handleRequestClose = () => {
    if (foodRef.current?.canGoBack()) {
      foodRef.current.goBack();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleRequestClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors?.white || '#FFFFFF'} />
        <FoodApp ref={foodRef} onClose={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background || '#FFFFFF',
  },
});
