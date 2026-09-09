import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import SecurityPrivacyHost from './SecurityPrivacyHost';
import HelpSupportHost from './HelpSupportHost';
import AboutHost from './AboutHost';
import PaymentsHost from './PaymentsHost';
import OrdersHost from './OrdersHost';
import AddressHost from './AddressHost';
import NotificationsHost from './NotificationsHost';
import GroceriesHost from './GroceriesHost';
import FoodHost from './FoodHost';

/**
 * The ten host components were written for the WebView era: each is a
 * full-screen `Modal` driven by `visible` + `onClose`, opened by a
 * `postMessage` from the document.
 *
 * Rather than rewrite ten working screens, each is mounted here as a route
 * that is always `visible` and whose `onClose` pops the stack. The stack
 * screens themselves are registered with `headerShown: false` and
 * `animation: 'none'`, so the Modal's own slide is the only transition —
 * no double animation.
 *
 * `onChange` callbacks that used to push state back into the document are
 * dropped: settings, addresses and security now read and write the shared
 * providers mounted at the app root, so there is nothing to mirror.
 */
function useDismiss(): () => void {
  const navigation = useNavigation();
  return useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation]);
}

export function SecurityPrivacyRoute() {
  return <SecurityPrivacyHost visible seed={null} onChange={() => {}} onClose={useDismiss()} />;
}

export function HelpSupportRoute() {
  return <HelpSupportHost visible onClose={useDismiss()} />;
}

export function AboutRoute() {
  return <AboutHost visible onClose={useDismiss()} />;
}

export function PaymentsRoute() {
  return <PaymentsHost visible onClose={useDismiss()} />;
}

export function OrdersRoute() {
  return <OrdersHost visible onClose={useDismiss()} onAction={() => {}} />;
}

export function AddressesRoute() {
  return <AddressHost visible onChange={() => {}} onClose={useDismiss()} />;
}

export function NotificationsRoute() {
  return <NotificationsHost visible onClose={useDismiss()} />;
}

export function GroceriesRoute() {
  return <GroceriesHost visible onClose={useDismiss()} />;
}

export function FoodRoute() {
  return <FoodHost visible onClose={useDismiss()} />;
}
