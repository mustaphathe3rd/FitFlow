// src/app/workout-summary.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppStore from '../../state/appStore';
import { StyledButton } from '../../components/common/StyledButton';

export default function WorkoutSummaryScreen() {
  const workoutPlan = useAppStore((state) => state.workoutPlan);

  if (!workoutPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No workout plan found. Go back and generate one!</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* The title now comes from the header we configured in _layout.tsx */}
      <Text style={styles.subtitle}>Estimated Duration: {workoutPlan.estimatedDurationMinutes} minutes</Text>

      <FlatList
        data={workoutPlan.exercises}
        keyExtractor={(item) => item.exerciseId}
        renderItem={({ item }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{item.order}. {item.name}</Text>
            <Text style={styles.exerciseDetails}>{item.sets} sets x {item.reps} reps</Text>
          </View>
        )}
        style={styles.list}
      />

      <View style={styles.footer}>
        <StyledButton title="Start Workout!" onPress={() => { /* Navigation to the player screen will go here */ }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  subtitle: { 
    fontSize: 16, 
    color: 'gray', 
    marginBottom: 20,
    marginTop: 10,
  },
  list: {
    width: '100%',
  },
  exerciseItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 12,
    width: '100%',
  },
  exerciseName: { fontSize: 18, fontWeight: '600' },
  exerciseDetails: { fontSize: 16, color: '#555', marginTop: 5 },
  footer: {
    width: '100%',
    paddingVertical: 10,
  },
});