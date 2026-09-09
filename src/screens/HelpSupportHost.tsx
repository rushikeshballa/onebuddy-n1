import React, { useRef } from 'react';
import { Modal, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HelpSupportScreen, { type HelpSupportRef } from '../native/screens/HelpSupport/screens/HelpAndSupportScreen';
import { COLORS } from '../native/constants/colors';

interface HelpSupportHostProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Opens the help project's screen full-screen over the WebView. The screen owns
 * all of its own state — search, FAQ sheet, chat thread — and none of it is
 * persisted, so unlike the other two hosts there is nothing to seed or relay.
 */
export default function HelpSupportHost({
  visible,
  onClose,
}: HelpSupportHostProps): React.JSX.Element {
  const helpRef = useRef<HelpSupportRef>(null);

  const handleRequestClose = () => {
    if (helpRef.current?.canGoBack()) {
      helpRef.current.goBack();
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
      // Remounting on each open clears the previous search and chat draft.
      key={visible ? 'help-open' : 'help-closed'}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <HelpSupportScreen ref={helpRef} onClose={onClose} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
});
