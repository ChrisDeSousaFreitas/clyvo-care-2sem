import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './src/routes/AppRoutes';
import { AuthProvider } from './src/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
