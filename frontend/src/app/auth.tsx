import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import useAuthStore from '../state/authStore';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { email, password });
      Alert.alert('Success', 'User created! Please log in.');
    } catch (error) {
      Alert.alert('Error', 'Registration failed.');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      login(token); // Call the login action from our store
    } catch (error) {
      Alert.alert('Error', 'Login failed. Check your credentials.');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

export default AuthScreen;