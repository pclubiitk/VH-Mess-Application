// app/verified-success.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter, Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';

export default function VerifiedSuccess() {
  const isDark = useTheme().dark;
  const styles = createStyles(isDark);
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Account Verified!</Text>
        <Text style={styles.message}>
          Your account has been successfully verified. You can now book food and enjoy our services.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function createStyles(isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
    },
    emoji: {
      fontSize: 60,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? Colors.dark.text : Colors.light.text,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      textAlign: 'center',
      color: isDark ? Colors.dark.text : Colors.light.text,
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    button: {
      backgroundColor: isDark ? Colors.dark.gray333 : Colors.light.grayeee,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
  });
}
