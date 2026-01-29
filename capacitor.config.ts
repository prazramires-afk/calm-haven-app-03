import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5c49515339db458b8f7c8ebe1debd511',
  appName: 'calm-haven-app-03',
  webDir: 'dist',
  server: {
    url: 'https://5c495153-39db-458b-8f7c-8ebe1debd511.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f1419',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f1419',
    },
  },
  android: {
    backgroundColor: '#0f1419',
  },
  ios: {
    backgroundColor: '#0f1419',
  },
};

export default config;
