import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES } from '../../constants/theme';
import { usePlayer } from '../../hooks/usePlayer';

const NOTIFICATION_OPTIONS = [
  { id: 'newReleases', label: 'New Releases', description: 'Get notified about new music' },
  { id: 'recommendations', label: 'Recommendations', description: 'Personalized suggestions' },
  { id: 'reminders', label: 'Sleep Reminders', description: 'Bedtime notifications' },
];

const NotificationsModal = ({ visible, onClose }) => {
  const { notifications, setNotifications } = usePlayer();

  const handleToggle = (id) => {
    setNotifications({
      ...notifications,
      [id]: !notifications[id],
    });
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
            <Text style={styles.title}>Notifications</Text>

            <View style={styles.options}>
              {NOTIFICATION_OPTIONS.map(option => (
                <View key={option.id} style={styles.option}>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <Switch
                    value={notifications[option.id]}
                    onValueChange={() => handleToggle(option.id)}
                    trackColor={{ 
                      false: COLORS.surface, 
                      true: COLORS.primary 
                    }}
                    thumbColor={COLORS.white}
                    ios_backgroundColor={COLORS.surface}
                  />
                </View>
              ))}
            </View>
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
  options: {},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingLG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionInfo: { flex: 1, marginRight: SIZES.paddingLG },
  optionLabel: {
    fontSize: SIZES.fontLG,
    color: COLORS.textPrimary,
  },
  optionDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});

export default NotificationsModal;
