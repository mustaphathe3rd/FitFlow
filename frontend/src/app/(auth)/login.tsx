import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import api from '../../services/api'; // Adjust path if necessary
import useAuthStore from '../../state/authStore';
import { StyledButton } from '@/src/components/common/StyledButton';
import { StyledInput } from '@/src/components/common/StyledInput'; // Adjust path if necessary
// Adjust path if necessary

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const loginAction = useAuthStore((state) => state.login);

  const handleRegister = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password.');
    }
    setIsLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      Alert.alert('Success!', 'Your account has been created. Please log in.');
      setIsLoginView(true); // Switch to login view after successful registration
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password.');
    }
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      if (token) {
        loginAction(token); // This will trigger the redirect in _layout.tsx
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Error', errorMessage);
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

      {isLoginView ? (
        <StyledButton title="Log In" onPress={handleLogin} isLoading={isLoading} />
      ) : (
        <StyledButton title="Register" onPress={handleRegister} isLoading={isLoading} />
      )}
      
      <Pressable onPress={() => setIsLoginView(!isLoginView)}>
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 5,
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#007AFF', // iOS blue color
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;