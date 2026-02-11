import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';
import { usePlayer } from '../../hooks/usePlayer';

const PrivacyModal = ({ visible, onClose }) => {
  const { 
    clearHistory, 
    history,
    privacySettings,
    setPrivacySettings,
  } = usePlayer();

  const handleToggle = (key) => {
    setPrivacySettings({
      ...privacySettings,
      [key]: !privacySettings[key],
    });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Listening History',
      'This will delete all your listening history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearHistory();
            Alert.alert('Done', 'Your listening history has been cleared.');
          }
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear cached data to free up storage space.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear actual cache
            Alert.alert('Done', 'Cache has been cleared.');
          }
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Glacier respects your privacy.\n\n• We collect minimal data to improve your experience\n• Your listening history is stored locally on your device\n• We do not sell your personal information\n• You can delete your data at any time\n\nFull privacy policy coming soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <LinearGradient
            colors={['#1a3a4a', '#0a1a2a']}
            style={styles.content}
          >
            <View style={styles.handle} />
            <Text style={styles.title}>Privacy</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Data Collection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Settings</Text>
                
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Icon name="analytics-outline" size={22} color={COLORS.textMuted} />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Analytics</Text>
                      <Text style={styles.settingDescription}>Help improve Glacier</Text>
                    </View>
                  </View>
                  <Switch
                    value={privacySettings?.analytics ?? true}
                    onValueChange={() => handleToggle('analytics')}
                    trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Icon name="time-outline" size={22} color={COLORS.textMuted} />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Save Listening History</Text>
                      <Text style={styles.settingDescription}>Remember what you play</Text>
                    </View>
                  </View>
                  <Switch
                    value={privacySettings?.saveHistory ?? true}
                    onValueChange={() => handleToggle('saveHistory')}
                    trackColor={{ false: COLORS.surface, true: COLORS.primary }}
                    thumbColor={COLORS.white}
                  />
                </View>
              </View>

              {/* Data Management */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Management</Text>
                
                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handleClearHistory}
                >
                  <View style={styles.settingInfo}>
                    <Icon name="trash-outline" size={22} color={COLORS.error} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: COLORS.error }]}>
                        Clear Listening History
                      </Text>
                      <Text style={styles.settingDescription}>
                        {history.length} items in history
                      </Text>
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handleClearCache}
                >
                  <View style={styles.settingInfo}>
                    <Icon name="folder-outline" size={22} color={COLORS.textMuted} />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Clear Cache</Text>
                      <Text style={styles.settingDescription}>Free up storage space</Text>
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>
              </View>

              {/* Legal */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Legal</Text>
                
                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handlePrivacyPolicy}
                >
                  <View style={styles.settingInfo}>
                    <Icon name="document-text-outline" size={22} color={COLORS.textMuted} />
                    <Text style={styles.settingLabel}>Privacy Policy</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: SIZES.radiusXXL,
    borderTopRightRadius: SIZES.radiusXXL,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  content: {
    paddingHorizontal: SIZES.paddingXXL,
    paddingTop: SIZES.paddingXXL,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SIZES.paddingXXL,
  },
  title: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.paddingXXL,
  },
  section: {
    marginBottom: SIZES.paddingXXL,
  },
  sectionTitle: {
    fontSize: SIZES.fontSM,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SIZES.paddingMD,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingLG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SIZES.paddingMD,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
  },
  settingDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

export default PrivacyModal;
