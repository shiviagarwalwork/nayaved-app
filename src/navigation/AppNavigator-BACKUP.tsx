import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import PlanScreen from '../screens/PlanScreen';
import BlogScreen from '../screens/BlogScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Assessment') {
              iconName = focused ? 'clipboard' : 'clipboard-outline';
            } else if (route.name === 'Plan') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Blog') {
              iconName = focused ? 'book' : 'book-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#9EBF88',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#F5F1E8',
          },
          headerTintColor: '#3E2723',
          tabBarStyle: {
            backgroundColor: '#F5F1E8',
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Quick Start' }}
        />
        <Tab.Screen
          name="Assessment"
          component={AssessmentScreen}
          options={{ title: 'Dosha Quiz' }}
        />
        <Tab.Screen
          name="Plan"
          component={PlanScreen}
          options={{ title: 'My Plan' }}
        />
        <Tab.Screen
          name="Blog"
          component={BlogScreen}
          options={{ title: 'Learn' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
