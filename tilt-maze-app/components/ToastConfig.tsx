import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  // Override existing success toast
  success: (props: any) => (
    <BaseToast
      {...props}
      style={styles.success}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '400',
      }}
      text2Style={{
        fontSize: 14,
        color: '#4CAF50',
      }}
    />
  ),
  // Customize error toast
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={styles.error}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '400',
      }}
    />
  ),
};

const styles = StyleSheet.create({
  success: {
    borderLeftColor: '#4CAF50',
  },
  error: {
    borderLeftColor: '#FF5252',
  },
});
