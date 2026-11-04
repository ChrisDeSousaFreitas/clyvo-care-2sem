import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/hooks/useAuth';
import AppRoutes from './src/routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppRoutes />
    </AuthProvider>
  );
}
