import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Onboarding from './components/Onboarding';
import OnboardingTwo from './components/MaskOnboarding';
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    'Anybody-Light': require('./assets/fonts/Anybody-Light.ttf'),
    'Anybody-Medium': require('./assets/fonts/Anybody-SemiBold.ttf'),
    'Anybody-Regular': require('./assets/fonts/Anybody-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <View style={styles.container}>
      <OnboardingTwo />
      <StatusBar style="auto" hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});
