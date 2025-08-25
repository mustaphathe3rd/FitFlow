import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import useAppStore from '../../state/appStore';
import api from '../../services/api';
import { StyledButton } from '../../components/common/StyledButton';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Equipment Lists ---
// These are items the user can always select.
const FREE_EQUIPMENT = ['Bodyweight', 'Mat / Towel', 'Bench / Chair', 'Wall', 'Backpack (Loaded)', 'Water Bottles / Jugs'];
// These items can be selected if the user has premium, or detected by the camera.
const PREMIUM_EQUIPMENT = ['Resistance Bands', 'Skipping Rope', 'Dumbbells', 'Kettlebell', 'Foam Roller', 'Pull-Up Bar'];

export default function WorkoutsScreen() {
  const router = useRouter();

  // --- Component State ---
  const [duration, setDuration] = useState(20);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(['Bodyweight']);
  const [isLoading, setIsLoading] = useState(false);

  // --- Global State from Zustand Store ---
  const {
    setWorkoutPlan,
    hasPremiumAccess,
    detectedEquipment,
    clearDetectedEquipment
  } = useAppStore();

  // --- Effect to handle equipment detected by the camera scanner ---
  useEffect(() => {
    if (detectedEquipment && detectedEquipment.length > 0) {
      // Add detected equipment to the list, avoiding duplicates
      setSelectedEquipment(prev => [...new Set([...prev, ...detectedEquipment])]);
      // Clear it from the store so it doesn't trigger again on re-render
      clearDetectedEquipment();
    }
  }, [detectedEquipment, clearDetectedEquipment]);

  // --- Helper Functions ---
  const toggleEquipment = (equipmentName: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipmentName)
        ? prev.filter(e => e !== equipmentName)
        : [...prev, equipmentName]
    );
  };

  const handleGenerateWorkout = async () => {
    if (selectedEquipment.length === 0) {
      Alert.alert('No Equipment Selected', 'Please select at least one piece of equipment to generate a workout.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/workouts/generate', {
        durationInMinutes: duration,
        equipmentNames: selectedEquipment,
      });
      setWorkoutPlan(response.data);
      router.push('/workout-summary');
    } catch (error) {
      console.error("Error generating workout:", error);
      Alert.alert('Error', 'Could not generate a workout at this time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Component Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Your Workout</Text>

        {/* Duration Slider */}
        <Text style={styles.label}>Duration: {duration} minutes</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={60}
          step={5}
          value={duration}
          onValueChange={setDuration}
          minimumTrackTintColor="#007BFF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#007BFF"
        />

        {/* Free Equipment Section */}
        <Text style={styles.label}>Select Your Available Equipment</Text>
        <View style={styles.equipmentContainer}>
          {FREE_EQUIPMENT.map(name => (
            <Pressable
              key={name}
              style={[
                styles.chip,
                selectedEquipment.includes(name) && styles.chipSelected
              ]}
              onPress={() => toggleEquipment(name)}
            >
              <Text style={[styles.chipText, selectedEquipment.includes(name) && styles.chipTextSelected]}>{name}</Text>
            </Pressable>
          ))}
        </View>

        {/* Premium Equipment Section (conditionally rendered) */}
        {hasPremiumAccess && (
          <>
            <Text style={styles.label}>Premium Equipment 👑</Text>
            <View style={styles.equipmentContainer}>
              {PREMIUM_EQUIPMENT.map(name => (
                <Pressable
                  key={name}
                  style={[
                    styles.chip,
                    selectedEquipment.includes(name) && styles.chipSelected
                  ]}
                  onPress={() => toggleEquipment(name)}
                >
                  <Text style={[styles.chipText, selectedEquipment.includes(name) && styles.chipTextSelected]}>{name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
        
        {/* If user is NOT premium, show a prompt to unlock more equipment */}
        {!hasPremiumAccess && (
          <Pressable onPress={() => router.push('/(tabs)/paywall')}>
            <Text style={styles.unlockText}>Unlock more equipment with Premium!</Text>
          </Pressable>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <StyledButton title="📷 Scan Equipment" onPress={() => router.push('/(modals)/scanner')} />
          <StyledButton title="Generate Workout" onPress={handleGenerateWorkout} isLoading={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  chipSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  chipText: {
    color: '#333',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  unlockText: {
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 20,
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 20,
  }
});