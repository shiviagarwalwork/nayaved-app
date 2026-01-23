import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ManuscriptColors } from '../components/ManuscriptConstants';

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        NayaVed <Text style={styles.aiText}>AI</Text> App Works!
      </Text>
      <Text style={styles.subtitle}>Testing minimal screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E2723',
    marginBottom: 16,
  },
  aiText: {
    color: '#B87333',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#5D4037',
  },
});
