// src/app/(tabs)/paywall.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import useAppStore from '../../state/appStore';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';
import { useRouter } from 'expo-router';
import { FeatureListItem } from '../../components/paywall/FeatureListItem'; // Import feature component
import { StyledButton } from '../../components/common/StyledButton'; // Import our styled button

export default function PaywallScreen() {
  const { offerings, isDeveloperMode } = useAppStore();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const grantPremiumAccess = useAppStore((state) => state.grantPremiumAccess);

  useEffect(() => {
    // Automatically select the first available package
    if (offerings?.current?.availablePackages.length) {
      setSelectedPackage(offerings.current.availablePackages[0]);
    }
  }, [offerings]);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    setIsLoading(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
      if (customerInfo.entitlements.active['premium']) {
        Alert.alert("Success!", "You now have premium access.");
        router.back();
      }
    } catch (e) {
      if (!e.userCancelled) {
        Alert.alert("Error Purchasing", e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatedPurchase = () => {
    Alert.alert('Developer Mode', `Premium access granted!.`);
    grantPremiumAccess(); // <-- This is the new, important line
    router.back();
  };

  if (!offerings && !isDeveloperMode) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const purchaseButtonTitle = selectedPackage?.product.introPrice ? 'Start 7-Day Free Trial' : 'Go Premium';
  const priceText = selectedPackage ? `${selectedPackage.product.priceString}/month after trial` : '$14.99/month after trial';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Your Full Potential with FitFlow Premium</Text>

      <FeatureListItem icon="dumbbell" title="Access All Equipment Libraries" description="Get workouts for any gear you have, from dumbbells to yoga mats." />
      <FeatureListItem icon="calendar-alt" title="Multi-Week Training Plans" description="Follow structured programs designed to help you reach your goals faster." />
      <FeatureListItem icon="chart-line" title="Advanced Progress Analytics" description="Track your performance with detailed charts and insights." />

      <View style={styles.footer}>
        <StyledButton 
          title={isDeveloperMode ? 'Simulate Purchase' : purchaseButtonTitle} 
          onPress={isDeveloperMode ? handleSimulatedPurchase : handlePurchase} 
          isLoading={isLoading} 
        />
        <Text style={styles.priceText}>{priceText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  priceText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});