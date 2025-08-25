import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import useAppStore from '@/src/state/appStore';

export default function HomeScreen() {
  const hasPremiumAccess = useAppStore((state) => state.hasPremiumAccess);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>

      {/* This message will only appear if hasPremiumAccess is true */}
      {hasPremiumAccess && (
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumText}>👑 You have Premium Access! 👑</Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
  premiumBanner: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e6f4ff',
    borderRadius: 8,
  },
  premiumText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});