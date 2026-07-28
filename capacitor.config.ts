import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.investorbucket.app',
  appName: 'Investor Bucket',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
