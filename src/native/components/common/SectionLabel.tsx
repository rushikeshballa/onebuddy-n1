import React, { ReactNode } from 'react';
import { Text } from 'react-native';
import { styles } from '../../screens/Security/styles';

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

export default SectionLabel;
