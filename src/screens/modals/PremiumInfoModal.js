import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';

const FEATURES = [
  { icon: 'musical-notes', text: 'Ad-free listening experience' },
  { icon: 'download', text: 'Unlimited offline downloads' },
  { icon: 'star', text: 'Exclusive premium content' },
  { icon: 'time', text: 'Early access to new releases' },
  { icon: 'cloud', text: 'Cloud sync across devices' },
];

const PremiumInfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modal}>
          <LinearGradient
            colors={['#1a3a4a', '#0a1a2a']}
            style={styles.content}
          >
            {/* Close button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Icon name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={['rgba(122,197,163,0.3)', 'rgba(74,138,154,0.3)']}
                style={styles.iconCircle}
              >
                <Icon name="checkmark-circle" size={40} color={COLORS.accent} />
              </LinearGradient>
              <Text style={styles.title}>Your Premium Benefits</Text>
              <Text style={styles.subtitle}>You're enjoying all these features</Text>
            </View>

            {/* Features */}
            <View style={styles.features}>
              {FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <Icon name={feature.icon} size={20} color={COLORS.accent} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                  <Icon name="checkmark" size={18} color={COLORS.accent} />
                </View>
              ))}
            </View>

            {/* Status */}
            <View style={styles.statusContainer}>
              <Icon name="star" size={20} color={COLORS.accent} />
              <Text style={styles.statusText}>Premium Active</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={onClose}
            >
              <Text style={styles.doneButtonText}>Got it</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingXXL,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    width: '100%',
    maxWidth: 360,
    borderRadius: SIZES.radiusXXL,
    overflow: 'hidden',
    elevation: 10,
  },
  content: {
    padding: SIZES.padding3XL,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.paddingLG,
    right: SIZES.paddingLG,
    zIndex: 10,
    padding: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.paddingXXL,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.paddingLG,
  },
  title: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingSM,
  },
  subtitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: SIZES.paddingXXL,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.paddingMD,
  },
  featureText: {
    flex: 1,
    fontSize: SIZES.fontMD,
    color: COLORS.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDim,
    paddingVertical: SIZES.paddingMD,
    paddingHorizontal: SIZES.paddingXL,
    borderRadius: SIZES.radiusXL,
    gap: SIZES.paddingSM,
    marginBottom: SIZES.paddingXXL,
  },
  statusText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.accent,
  },
  doneButton: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXL,
    paddingVertical: SIZES.paddingLG,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});

export default PremiumInfoModal;
