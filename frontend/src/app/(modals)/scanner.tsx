// src/app/(modals)/scanner.tsx - FIXED VERSION

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// --- FIX #1: Import Camera view and constants ---
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { StyledButton } from '../../components/common/StyledButton';
import useAppStore from '../../state/appStore';
import { aiApi } from '../../services/api';

export default function ScannerScreen() {
  // --- FIX #2: Use the new useCameraPermissions hook ---
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const setDetectedEquipment = useAppStore((state) => state.setDetectedEquipment);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const takePictureAndAnalyze = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        // The takePictureAsync method is called on the ref
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        
        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);

        const response = await aiApi.post('/detect', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const detectedItems = response.data.map((item: any) => item.label);
        const uniqueItems = [...new Set(detectedItems)];
        
        setDetectedEquipment(uniqueItems);
        router.back();

      } catch (error) {
        console.error("Error analyzing image:", error);
        Alert.alert("Error", "Could not analyze the image. Please check if the AI server is running.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator /></View>; // Show loading while waiting for permission
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera. Please grant permission in your settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Scanner" }} />
      {/* --- FIX #3: Use CameraView instead of Camera --- */}
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      
      <View style={styles.buttonContainer}>
        {isProcessing ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <StyledButton title="Analyze Gym Equipment" onPress={takePictureAndAnalyze} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  camera: { flex: 1, width: '100%' },
  errorText: { color: 'white', fontSize: 16, textAlign: 'center', padding: 20 },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
});