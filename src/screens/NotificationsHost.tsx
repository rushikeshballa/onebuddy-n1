import React from 'react';
import { Modal, StyleSheet } from 'react-native';

import NotificationSettingsScreen from '../native/screens/Notifications/screens/NotificationSettingsScreen';

interface NotificationsHostProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsHost({
  visible,
  onClose,
}: NotificationsHostProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <NotificationSettingsScreen onBack={onClose} />
    </Modal>
  );
}

const styles = StyleSheet.create({});
