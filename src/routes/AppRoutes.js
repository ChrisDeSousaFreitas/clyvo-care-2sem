import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../hooks/useAuth';
import { configureNotifications } from '../services/notifications';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PetsListScreen from '../screens/PetsListScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
import SmartCollarScreen from '../screens/SmartCollarScreen';
import PetProfileScreen from '../screens/PetProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import AssistantScreen from '../screens/AssistantScreen';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef();

function openAppointmentFromNotification(response) {
  const destination = response?.notification?.request?.content?.data?.screen;
  if (destination === 'Agendamentos' && navigationRef.isReady()) {
    navigationRef.navigate('Agendamentos');
  }
}

export default function AppRoutes() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    configureNotifications().catch((error) => {
      console.warn('Não foi possível configurar as notificações:', error);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      openAppointmentFromNotification
    );

    return () => subscription.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F7F6' }}>
        <ActivityIndicator size="large" color="#1C8DA3" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={async () => {
        try {
          const lastResponse = await Notifications.getLastNotificationResponseAsync();
          openAppointmentFromNotification(lastResponse);
        } catch (error) {
          console.warn('Não foi possível recuperar a notificação inicial:', error);
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Pets" component={PetsListScreen} />
            <Stack.Screen name="Agendamentos" component={AgendamentoScreen} />
            <Stack.Screen name="Collar" component={SmartCollarScreen} />
            <Stack.Screen name="PetProfile" component={PetProfileScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Assistant" component={AssistantScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
