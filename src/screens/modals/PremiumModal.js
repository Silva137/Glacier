import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, GRADIENTS } from '../../constants/theme';
import { usePlayer } from '../../hooks/usePlayer';

const FEATURES = [
  'Ad-free listening experience',
  'Unlimited offline downloads',
  'Exclusive premium content',
  'Early access to new releases',
  'Cloud sync across devices',
];

const PremiumModal = ({ visible, onClose }) => {
  const { activatePremium } = usePlayer();

  const handleStartTrial = () => {
    activatePremium();
    onClose();
    // Show alert after closing modal
    setTimeout(() => {
      Alert.alert(
        '🎉 Welcome to Premium!',
        'Your 7-day free trial has started. Enjoy unlimited downloads and ad-free listening!',
        [{ text: 'Awesome!' }]
      );
    }, 300);
  };

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

            {/* Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['rgba(122,197,163,0.3)', 'rgba(74,138,154,0.3)']}
                style={styles.iconCircle}
              >
                <Icon name="star" size={40} color={COLORS.accent} />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text style={styles.title}>Glacier Premium</Text>
            <Text style={styles.subtitle}>Unlock the full experience</Text>

            {/* Features */}
            <View style={styles.features}>
              {FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Icon name="checkmark-circle" size={20} color={COLORS.accent} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>€1.99</Text>
              <Text style={styles.priceUnit}>/month</Text>
            </View>

            {/* CTA Button - Using Pressable for better touch handling */}
            <Pressable 
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed
              ]}
              onPress={handleStartTrial}
            >
              <LinearGradient
                colors={GRADIENTS.button}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>Start 7-Day Free Trial</Text>
              </LinearGradient>
            </Pressable>

            <Text style={styles.termsText}>
              Cancel anytime. No commitment required.
            </Text>

            {/* Dismiss */}
            <TouchableOpacity 
              onPress={onClose}
              style={styles.dismissButton}
              hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
            >
              <Text style={styles.dismissText}>Maybe later</Text>
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
  iconContainer: {
    marginBottom: SIZES.paddingXXL,
    marginTop: SIZES.paddingMD,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.font4XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: SIZES.paddingSM,
  },
  subtitle: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    marginBottom: SIZES.paddingXXL,
  },
  features: {
    alignSelf: 'stretch',
    marginBottom: SIZES.paddingXXL,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.paddingMD,
    marginBottom: SIZES.paddingMD,
  },
  featureText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    paddingVertical: SIZES.paddingXL,
    paddingHorizontal: SIZES.padding3XL,
    marginBottom: SIZES.paddingXXL,
  },
  price: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  priceUnit: {
    fontSize: SIZES.fontLG,
    color: COLORS.textMuted,
  },
  ctaButton: {
    alignSelf: 'stretch',
    borderRadius: SIZES.radiusXXL,
    overflow: 'hidden',
  },
  ctaButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  ctaGradient: {
    paddingVertical: SIZES.paddingLG + 2,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: COLORS.white,
  },
  termsText: {
    fontSize: SIZES.fontSM,
    color: COLORS.textDim,
    marginTop: SIZES.paddingMD,
  },
  dismissButton: {
    paddingVertical: SIZES.paddingMD,
    paddingHorizontal: SIZES.paddingXXL,
    marginTop: SIZES.paddingSM,
  },
  dismissText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
});

export default PremiumModal;
