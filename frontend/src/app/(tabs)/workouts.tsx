import { Text, View, StyleSheet } from 'react-native';
export default function WorkoutsScreen() {
  return (<View style={styles.container}><Text style={styles.text}>Workouts Screen</Text></View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
