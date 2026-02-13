// src/components/DevTools.js
// TEMPORARY: Remove this component before production!

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { seedFirestore, clearFirestore } from '../services/seedFirestore';

const DevTools = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSeedDatabase = async () => {
    Alert.alert(
      'Seed Database',
      'This will populate Firestore with sample data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            setIsSeeding(true);
            try {
              const result = await seedFirestore();
              if (result.success) {
                Alert.alert('Success! 🎉', 'Database seeded successfully. Restart the app to see the data.');
              } else {
                Alert.alert('Error', result.error || 'Failed to seed database');
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setIsSeeding(false);
            }
          },
        },
      ]
    );
  };

  const handleClearDatabase = async () => {
    Alert.alert(
      'Clear Database',
      '⚠️ This will DELETE all data from Firestore. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              const result = await clearFirestore();
              if (result.success) {
                Alert.alert('Cleared', 'Database cleared successfully.');
              } else {
                Alert.alert('Error', result.error || 'Failed to clear database');
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Dev Tools</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.seedButton]}
        onPress={handleSeedDatabase}
        disabled={isSeeding}
      >
        {isSeeding ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>🌱 Seed Database</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={handleClearDatabase}
        disabled={isClearing}
      >
        {isClearing ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>🗑️ Clear Database</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        Remove DevTools before production!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    margin: SIZES.paddingXXL,
    borderRadius: SIZES.radiusLG,
    padding: SIZES.paddingXXL,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingLG,
    textAlign: 'center',
  },
  button: {
    paddingVertical: SIZES.paddingMD,
    paddingHorizontal: SIZES.paddingXL,
    borderRadius: SIZES.radiusMD,
    marginBottom: SIZES.paddingSM,
    alignItems: 'center',
  },
  seedButton: {
    backgroundColor: COLORS.accent,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.white,
  },
  note: {
    fontSize: SIZES.fontXS,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: SIZES.paddingMD,
  },
});

export default DevTools;
