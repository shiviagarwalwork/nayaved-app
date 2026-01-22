import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import QuickFixDetailScreen from '../screens/QuickFixDetailScreen';
import TongueDiagnosisScreen from '../screens/TongueDiagnosisScreen';
import PulseAnalysisScreen from '../screens/PulseAnalysisScreen';
import SkinAnalysisScreen from '../screens/SkinAnalysisScreen';
import EyeAnalysisScreen from '../screens/EyeAnalysisScreen';
import NailAnalysisScreen from '../screens/NailAnalysisScreen';
import AssessmentScreen from '../screens/AssessmentScreen'; // Accessed via HomeStack, not tab
import OjasTrackerScreen from '../screens/OjasTrackerScreen';
import BodyMapScreen from '../screens/BodyMapScreen';
import PlanScreen from '../screens/PlanScreen';
import BlogScreen from '../screens/BlogScreen';
import PharmacyScreen from '../screens/PharmacyScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const BlogStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen
        name="QuickFixDetail"
        component={QuickFixDetailScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Quick Fix Details',
        }}
      />
      <HomeStack.Screen
        name="Assessment"
        component={AssessmentScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Dosha Assessment',
        }}
      />
      <HomeStack.Screen
        name="TongueDiagnosis"
        component={TongueDiagnosisScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Tongue Diagnosis',
        }}
      />
      <HomeStack.Screen
        name="PulseAnalysis"
        component={PulseAnalysisScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Pulse Analysis',
        }}
      />
      <HomeStack.Screen
        name="SkinAnalysis"
        component={SkinAnalysisScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Skin Analysis',
        }}
      />
      <HomeStack.Screen
        name="EyeAnalysis"
        component={EyeAnalysisScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Eye Analysis',
        }}
      />
      <HomeStack.Screen
        name="NailAnalysis"
        component={NailAnalysisScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Nail Analysis',
        }}
      />
    </HomeStack.Navigator>
  );
}

function BlogStackNavigator() {
  return (
    <BlogStack.Navigator screenOptions={{ headerShown: false }}>
      <BlogStack.Screen name="BlogMain" component={BlogScreen} />
      <BlogStack.Screen
        name="BodyMap"
        component={BodyMapScreen}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#F5F1E8' },
          headerTintColor: '#3E2723',
          title: 'Body Map',
        }}
      />
    </BlogStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Consult') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Ojas') {
              iconName = focused ? 'sparkles' : 'sparkles-outline';
            } else if (route.name === 'Pharmacy') {
              iconName = focused ? 'medkit' : 'medkit-outline';
            } else if (route.name === 'Plan') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Blog') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
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
          component={HomeStackNavigator}
          options={{ title: 'Quick Start' }}
        />
        <Tab.Screen
          name="Consult"
          component={ConsultationScreen}
          options={{ title: 'Ask Vaidya' }}
        />
        <Tab.Screen
          name="Ojas"
          component={OjasTrackerScreen}
          options={{ title: 'Ojas Glow' }}
        />
        <Tab.Screen
          name="Plan"
          component={PlanScreen}
          options={{ title: 'My Plan' }}
        />
        <Tab.Screen
          name="Blog"
          component={BlogStackNavigator}
          options={{ title: 'Learn' }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
