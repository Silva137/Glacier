import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, GRADIENTS } from '../../constants/theme';

const SignInModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    Alert.alert(
      'Coming Soon! 🚀',
      'Sign in functionality will be available in a future update. Stay tuned!',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      'Coming Soon! 🚀',
      'Google Sign In will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleAppleSignIn = () => {
    Alert.alert(
      'Coming Soon! 🚀',
      'Apple Sign In will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.modal}>
          <LinearGradient
            colors={['#1a3a4a', '#0a1a2a']}
            style={styles.content}
          >
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome to Glacier</Text>
              <Text style={styles.subtitle}>Sign in to sync your data across devices</Text>
            </View>

            {/* Coming Soon Banner */}
            <View style={styles.comingSoonBanner}>
              <Icon name="construct-outline" size={20} color={COLORS.accent} />
              <Text style={styles.comingSoonText}>Authentication coming soon!</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.textDim}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.textDim}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color={COLORS.textMuted} 
                />
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={GRADIENTS.button}
                style={styles.signInGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign In */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
              >
                <Icon name="logo-google" size={22} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={handleAppleSignIn}
              >
                <Icon name="logo-apple" size={22} color={COLORS.white} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingXXL,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: SIZES.radiusXXL,
    overflow: 'hidden',
  },
  content: {
    padding: SIZES.paddingXXL,
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.paddingLG,
    right: SIZES.paddingLG,
    padding: SIZES.paddingSM,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.paddingXXL,
    marginTop: SIZES.paddingLG,
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
    textAlign: 'center',
  },
  comingSoonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentDim,
    borderRadius: SIZES.radiusMD,
    padding: SIZES.paddingMD,
    marginBottom: SIZES.paddingXXL,
    gap: SIZES.paddingSM,
  },
  comingSoonText: {
    fontSize: SIZES.fontSM,
    color: COLORS.accent,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: SIZES.paddingLG,
    marginBottom: SIZES.paddingMD,
    gap: SIZES.paddingMD,
  },
  input: {
    flex: 1,
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
    paddingVertical: SIZES.paddingLG,
  },
  signInButton: {
    borderRadius: SIZES.radiusXXL,
    overflow: 'hidden',
    marginTop: SIZES.paddingMD,
  },
  signInGradient: {
    paddingVertical: SIZES.paddingLG,
    alignItems: 'center',
  },
  signInText: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: COLORS.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.paddingXXL,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginHorizontal: SIZES.paddingMD,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: SIZES.paddingMD,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingVertical: SIZES.paddingMD,
    gap: SIZES.paddingSM,
  },
  socialButtonText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.paddingXXL,
  },
  signUpText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
  signUpLink: {
    fontSize: SIZES.fontMD,
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default SignInModal;
