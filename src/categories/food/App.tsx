import React, { useState, useEffect, useCallback, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Device from 'expo-device';

let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log('Push notifications are not supported in this environment (e.g. Expo Go Android SDK 53+).');
}
import { CartProvider } from './src/context/CartContext';
import { FilterProvider } from './src/context/FilterContext';
import { Header } from './src/components/common/Header';
import { BottomNavBar } from './src/components/navigation/BottomNavBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { RestaurantMenuScreen } from './src/screens/RestaurantMenuScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { LocationSearchScreen } from './src/screens/LocationSearchScreen';
import { AddAddressScreen } from './src/screens/AddAddressScreen';
import { ConflictModal } from './src/components/common/ConflictModal';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import CartScreen from './src/components/cart/CartScreen';
import PaymentCheckoutScreen from './src/components/cart/PaymentCheckoutScreen';
import FeedbackFormScreen from './src/components/common/FeedbackFormScreen';
import type { CartItem } from './src/components/types';
import { Address, loadAddresses } from './src/data/address';

export type ScreenType =
  | 'home'
  | 'restaurant-menu'
  | 'orders'
  | 'favorites'
  | 'location-search'
  | 'add-address'
  | 'cart'
  | 'checkout'
  | 'feedback';

export interface FoodAppRef {
  canGoBack: () => boolean;
  goBack: () => boolean;
}

export interface FoodAppProps {
  onClose?: () => void;
}

const App = React.forwardRef<FoodAppRef, FoodAppProps>(function App({ onClose }, ref) {
  const [screenStack, setScreenStack] = useState<ScreenType[]>(['home']);
  const currentScreen = screenStack[screenStack.length - 1] ?? 'home';
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('paradise-restaurant');
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutRestaurantName, setCheckoutRestaurantName] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleSelectRestaurant = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setScreenStack((prev) => [...prev, 'restaurant-menu']);
  };

  const handleNavigate = (screen: ScreenType) => {
    if (screen === 'home') {
      setScreenStack(['home']);
      return;
    }
    setScreenStack((prev) => (prev[prev.length - 1] === screen ? prev : [...prev, screen]));
  };

  const handleBack = useCallback(() => {
    if (screenStack.length > 1) {
      setScreenStack((prev) => prev.slice(0, -1));
      return true;
    }
    if (onClose) {
      onClose();
      return true;
    }
    return false;
  }, [screenStack, onClose]);

  useImperativeHandle(
    ref,
    () => ({
      canGoBack: () => screenStack.length > 1,
      goBack: handleBack,
    }),
    [screenStack, handleBack]
  );

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      return handleBack();
    });
    return () => sub.remove();
  }, [handleBack]);

  useEffect(() => {
    loadAddresses();
    async function requestPermissions() {
      if (!Notifications) return;
      if (Platform.OS !== 'web' && Device.isDevice) {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
        } catch (e) {
          console.log('Error requesting permissions', e);
        }
      } else if (Platform.OS === 'web') {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
              console.log('Notification permission denied on web');
          }
        } catch (e) {
          console.log('Error requesting permissions', e);
        }
      }
    }

    requestPermissions();
  }, []);

  const hideHeader = currentScreen === 'cart' || currentScreen === 'checkout' || currentScreen === 'feedback';
  const hideFooter = currentScreen === 'checkout' || currentScreen === 'feedback';

  return (
    <SafeAreaProvider>
      <CartProvider>
        <FilterProvider>
          <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />

            {/* Sticky Header */}
            {!hideHeader && (
              <Header 
                onNavigate={handleNavigate} 
                activeScreen={currentScreen} 
                onEditAddress={(address) => {
                  setEditingAddress(address);
                  handleNavigate('add-address');
                }}
                onBack={screenStack.length > 1 || onClose ? handleBack : undefined}
              />
            )}

            {/* Active Screen View */}
            <View style={styles.content}>
              {currentScreen === 'feedback' && completedOrder && (
                <ErrorBoundary>
                  <FeedbackFormScreen 
                    order={completedOrder} 
                    onComplete={() => handleNavigate('home')} 
                  />
                </ErrorBoundary>
              )}

              {currentScreen === 'home' && (
                <HomeScreen
                  onSelectRestaurant={handleSelectRestaurant}
                  onNavigate={handleNavigate}
                />
              )}

              {currentScreen === 'restaurant-menu' && (
                <RestaurantMenuScreen
                  restaurantId={selectedRestaurantId}
                  onBack={handleBack}
                />
              )}

              {currentScreen === 'orders' && (
                <OrdersScreen
                  onSelectRestaurant={handleSelectRestaurant}
                  onNavigateHome={handleBack}
                />
              )}

              {currentScreen === 'favorites' && (
                <FavoritesScreen
                  onSelectRestaurant={handleSelectRestaurant}
                  onNavigateHome={handleBack}
                />
              )}

              {currentScreen === 'cart' && (
                <CartScreen 
                  onBack={handleBack}
                  onProceed={(total, items, rName) => {
                    setCheckoutTotal(total);
                    setCheckoutItems(items);
                    setCheckoutRestaurantName(rName);
                    handleNavigate('checkout');
                  }}
                />
              )}

              {currentScreen === 'checkout' && (
                <PaymentCheckoutScreen 
                  grandTotal={checkoutTotal}
                  cartItems={checkoutItems}
                  onBack={handleBack}
                  onOrderSuccess={(orderData) => {
                    setCompletedOrder({ ...orderData, restaurantName: checkoutRestaurantName });
                  }}
                  onFinishReceipt={() => {
                    handleNavigate('feedback');
                  }}
                />
              )}

              {currentScreen === 'location-search' && (
                <LocationSearchScreen
                  onBack={handleBack}
                  onLocationSelected={() => {
                    setEditingAddress(null);
                    handleNavigate('add-address');
                  }}
                  onEditAddress={(address) => {
                    setEditingAddress(address);
                    handleNavigate('add-address');
                  }}
                />
              )}

              {currentScreen === 'add-address' && (
                <AddAddressScreen
                  initialData={editingAddress}
                  onBack={() => {
                    setEditingAddress(null);
                    handleBack();
                  }}
                  onSaveSuccess={() => {
                    setEditingAddress(null);
                    handleBack();
                  }}
                />
              )}
            </View>

            {/* Bottom Navigation Bar */}
            {!hideFooter && (
              <BottomNavBar
                activeScreen={currentScreen}
                onNavigate={handleNavigate}
                onFocusSearch={() => {
                  handleNavigate('home');
                }}
              />
            )}
            <ConflictModal />
          </SafeAreaView>
        </FilterProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
});

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
});
