import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import api from '../../services/api';
import useAppStore from '../../state/appStore';
import { StyledButton } from '../../components/common/StyledButton';
import { StyledInput } from '../../components/common/StyledInput';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const loginAction = useAppStore((state) => state.login);
  
  // --- 1. Add state for error messages ---
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      // --- 2. Use setError instead of Alert ---
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    // --- 3. Clear previous errors on a new attempt ---
    setError(''); 
    try {
      await api.post('/auth/register', { email, password });
      Alert.alert('Success!', 'Your account has been created. Please log in.');
      setIsLoginView(true); // Switch to login view after successful registration
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      // --- 2. Use setError instead of Alert ---
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      // --- 2. Use setError instead of Alert ---
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    // --- 3. Clear previous errors on a new attempt ---
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      if (token) {
        await loginAction(token);
        useAppStore.getState().fetchOfferings(); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      // --- 2. Use setError instead of Alert ---
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLoginView ? 'Welcome Back!' : 'Create Account'}
      </Text>

      <StyledInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <StyledInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* --- 4. Display the error message --- */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isLoginView ? (
        <StyledButton title="Log In" onPress={handleLogin} isLoading={isLoading} />
      ) : (
        <StyledButton title="Register" onPress={handleRegister} isLoading={isLoading} />
      )}
      
      <Pressable onPress={() => {
        setIsLoginView(!isLoginView);
        setError(''); // Clear error when toggling
      }}>
        <Text style={styles.toggleText}>
          {isLoginView
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Log In'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  // --- 5. Add the new style for the error text ---
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
});

export default LoginScreen;