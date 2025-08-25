// src/components/paywall/FeatureListItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Or your preferred icon library

interface FeatureProps {
  icon: React.ComponentProps<typeof FontAwesome5>['name'];
  title: string;
  description: string;
}

export const FeatureListItem = ({ icon, title, description }: FeatureProps) => {
  return (
    <View style={styles.container}>
      <FontAwesome5 name={icon} size={24} color="#007BFF" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  icon: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});