import React from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';

export const StyledButton = ({ title, onPress, isLoading = false }) => {
  return (
    <Pressable style={styles.button} onPress={onPress} disabled={isLoading}>
      {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF', // Primary blue from your design
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});