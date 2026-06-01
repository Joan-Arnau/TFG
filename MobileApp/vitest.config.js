import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'expo-status-bar': path.resolve(__dirname, './src/test/mocks/expo-status-bar.js'),
      'expo-constants': path.resolve(__dirname, './src/test/mocks/expo-constants.js'),
      'expo-location': path.resolve(__dirname, './src/test/mocks/expo-location.js'),
      '@react-navigation/native': path.resolve(__dirname, './src/test/mocks/react-navigation-native.js'),
      '@react-navigation/native-stack': path.resolve(__dirname, './src/test/mocks/react-navigation-native-stack.js'),
      'react-native': path.resolve(__dirname, './src/test/mocks/react-native.js'),
      '@expo/vector-icons': path.resolve(__dirname, './src/test/mocks/expo-vector-icons.js'),
      'react-native-webview': path.resolve(__dirname, './src/test/mocks/react-native-webview.js'),
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
