import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import {
  ObjectDetectionConfig,
  useObjectDetectionModels,
  useObjectDetectionProvider,
} from "@infinitered/react-native-mlkit-object-detection";

// Define your custom model for the provider
const MODELS: ObjectDetectionConfig = {
  fitflowDetector: {
    // We are still using the official test model for now
    model: require('../../assets/ml/efficientdet_lite0.tflite'),
    options: {
      shouldEnableMultipleObjects: true,
      shouldEnableClassification: true,
      detectorMode: "stream",
    },
  },
};
export type FitFlowModels = typeof MODELS;

export function MLModelProvider({ children }: { children: React.ReactNode }) {
  const models = useObjectDetectionModels<FitFlowModels>({
    assets: MODELS,
  });
  const { ObjectDetectionProvider } = useObjectDetectionProvider(models);

  // This provider will show a loading screen until the models are ready
  if (!models.isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ color: 'black', marginTop: 10 }}>Loading AI Model...</Text>
      </View>
    );
  }

  console.log("✅ ML Model has been loaded!");

  // Once loaded, it provides the model to its children
  return (
    <ObjectDetectionProvider>
      {children}
    </ObjectDetectionProvider>
  );
}