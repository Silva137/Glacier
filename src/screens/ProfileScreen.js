import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';
import { usePlayer } from '../hooks/usePlayer';
import { GradientBackground } from '../components';
import SleepTimerModal from './modals/SleepTimerModal';
import PremiumModal from './modals/PremiumModal';
import PremiumInfoModal from './modals/PremiumInfoModal';
import DownloadQualityModal from './modals/DownloadQualityModal';
import NotificationsModal from './modals/NotificationsModal';
import PrivacyModal from './modals/PrivacyModal';
import HelpSupportModal from './modals/HelpSupportModal';
import SignInModal from './modals/SignInModal';

const ProfileScreen = ({ navigation }) => {
  const { isPremium, activatePremium, deactivatePremium, sleepTimerActive, sleepTimer } = usePlayer();
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showPremiumInfo, setShowPremiumInfo] = useState(false);
  const [showDownloadQuality, setShowDownloadQuality] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'What would you like to do?',
      [
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Cancel Premium?',
              'Are you sure you want to cancel your premium subscription? You will lose access to unlimited downloads and ad-free listening.',
              [
                { text: 'Keep Premium', style: 'cancel' },
                { 
                  text: 'Cancel Premium', 
                  style: 'destructive',
                  onPress: () => {
                    deactivatePremium();
                    Alert.alert('Subscription Cancelled', 'You have been switched to the free plan.');
                  }
                },
              ]
            );
          }
        },
        { text: 'View Benefits', onPress: () => setShowPremiumInfo(true) },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleSignIn = () => {
    setShowSignIn(true);
  };

  const settingsItems = [
    { icon: 'moon-outline', label: 'Sleep Timer', onPress: () => setShowSleepTimer(true), badge: sleepTimerActive ? `${sleepTimer}m` : null },
    { icon: 'cloud-download-outline', label: 'Download Quality', onPress: () => setShowDownloadQuality(true) },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => setShowNotifications(true) },
    { icon: 'shield-outline', label: 'Privacy', onPress: () => setShowPrivacy(true) },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => setShowHelp(true) },
  ];

  return (
    <GradientBackground type="background">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          {/* User Card */}
          <View style={styles.userCard}>
            <LinearGradient
              colors={GRADIENTS.button}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="person" size={28} color={COLORS.white} />
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Guest User</Text>
              <Text style={styles.userSubtitle}>Sign in to sync data</Text>
            </View>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
              activeOpacity={0.7}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Card */}
          {!isPremium ? (
            <View style={styles.premiumCard}>
              <LinearGradient
                colors={GRADIENTS.premium}
                style={styles.premiumGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity 
                  style={styles.premiumContent}
                  onPress={() => setShowPremium(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.premiumHeader}>
                    <Icon name="star" size={24} color={COLORS.accent} />
                    <Text style={styles.premiumTitle}>Glacier Premium</Text>
                  </View>
                  <Text style={styles.premiumDescription}>
                    Ad-free, unlimited downloads for €1.99/month
                  </Text>
                </TouchableOpacity>
                
                <Pressable 
                  style={({ pressed }) => [
                    styles.premiumButton,
                    pressed && styles.premiumButtonPressed
                  ]}
                  onPress={() => setShowPremium(true)}
                >
                  <LinearGradient
                    colors={GRADIENTS.button}
                    style={styles.premiumButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.premiumButtonText}>Start Free Trial</Text>
                  </LinearGradient>
                </Pressable>
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.premiumActiveContainer}>
              <View style={styles.premiumActiveCard}>
                <Icon name="star" size={24} color={COLORS.accent} />
                <View style={styles.premiumActiveInfo}>
                  <Text style={styles.premiumActiveText}>Premium Active</Text>
                  <Text style={styles.premiumActiveSubtext}>Unlimited downloads & ad-free</Text>
                </View>
              </View>
              
              {/* Manage Subscription Button */}
              <TouchableOpacity 
                style={styles.manageButton}
                onPress={handleManageSubscription}
                activeOpacity={0.7}
              >
                <Icon name="settings-outline" size={18} color={COLORS.textMuted} />
                <Text style={styles.manageButtonText}>Manage Subscription</Text>
                <Icon name="chevron-forward" size={18} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>
          )}

          {/* Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <Icon name={item.icon} size={22} color={COLORS.textMuted} />
                <Text style={styles.settingLabel}>{item.label}</Text>
                <View style={styles.settingRight}>
                  {item.badge && (
                    <View style={styles.settingBadge}>
                      <Text style={styles.settingBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>Glacier</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <SleepTimerModal visible={showSleepTimer} onClose={() => setShowSleepTimer(false)} />
      <PremiumModal visible={showPremium} onClose={() => setShowPremium(false)} />
      <PremiumInfoModal visible={showPremiumInfo} onClose={() => setShowPremiumInfo(false)} />
      <DownloadQualityModal visible={showDownloadQuality} onClose={() => setShowDownloadQuality(false)} />
      <NotificationsModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
      <PrivacyModal visible={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <HelpSupportModal visible={showHelp} onClose={() => setShowHelp(false)} />
      <SignInModal visible={showSignIn} onClose={() => setShowSignIn(false)} />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: SIZES.tabBarHeight + SIZES.miniPlayerHeight + 20 },
  header: { paddingHorizontal: SIZES.paddingXXL, paddingTop: SIZES.paddingLG, paddingBottom: SIZES.paddingXXL },
  title: { fontSize: SIZES.font5XL, fontWeight: '300', color: COLORS.textPrimary },
  
  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.paddingXXL,
    borderRadius: SIZES.radiusXL,
    padding: SIZES.paddingXXL,
    marginBottom: SIZES.padding3XL,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, marginLeft: SIZES.paddingLG },
  userName: { fontSize: SIZES.fontXL - 1, fontWeight: '600', color: COLORS.textPrimary },
  userSubtitle: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: 4 },
  signInButton: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: SIZES.radiusXL,
    paddingHorizontal: SIZES.paddingLG,
    paddingVertical: SIZES.paddingSM + 2,
  },
  signInText: { fontSize: SIZES.fontMD, color: COLORS.textPrimary },
  
  // Premium Card
  premiumCard: { marginHorizontal: SIZES.paddingXXL, marginBottom: SIZES.padding3XL },
  premiumGradient: {
    borderRadius: SIZES.radiusXL,
    padding: SIZES.paddingXXL,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
  },
  premiumContent: {
    marginBottom: SIZES.paddingLG,
  },
  premiumHeader: { flexDirection: 'row', alignItems: 'center', gap: SIZES.paddingMD, marginBottom: SIZES.paddingMD },
  premiumTitle: { fontSize: SIZES.fontXL, fontWeight: '600', color: COLORS.accent },
  premiumDescription: { fontSize: SIZES.fontMD, color: COLORS.textSecondary },
  premiumButton: { 
    alignSelf: 'flex-start',
    borderRadius: SIZES.radiusXXL,
    overflow: 'hidden',
  },
  premiumButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  premiumButtonGradient: { 
    borderRadius: SIZES.radiusXXL, 
    paddingHorizontal: SIZES.paddingXXL, 
    paddingVertical: SIZES.paddingMD + 2,
  },
  premiumButtonText: { fontSize: SIZES.fontMD + 1, fontWeight: '600', color: COLORS.white },
  
  // Premium Active
  premiumActiveContainer: {
    marginHorizontal: SIZES.paddingXXL,
    marginBottom: SIZES.padding3XL,
  },
  premiumActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: SIZES.radiusLG,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: SIZES.paddingXL,
    gap: SIZES.paddingMD,
  },
  premiumActiveInfo: {
    flex: 1,
  },
  premiumActiveText: { fontSize: SIZES.fontLG, fontWeight: '600', color: COLORS.accent },
  premiumActiveSubtext: { fontSize: SIZES.fontSM, color: COLORS.textMuted, marginTop: 2 },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderTopWidth: 0,
    borderRadius: SIZES.radiusLG,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: SIZES.paddingLG,
    gap: SIZES.paddingSM,
  },
  manageButtonText: {
    flex: 1,
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
  
  // Settings
  settingsSection: { paddingHorizontal: SIZES.paddingXXL },
  sectionTitle: { fontSize: SIZES.font2XL, fontWeight: '300', color: COLORS.textPrimary, marginBottom: SIZES.paddingLG },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingLG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: SIZES.paddingLG,
  },
  settingLabel: { flex: 1, fontSize: SIZES.fontMD + 1, color: COLORS.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: SIZES.paddingSM },
  settingBadge: { backgroundColor: COLORS.accentDim, paddingHorizontal: SIZES.paddingSM + 2, paddingVertical: 2, borderRadius: SIZES.radiusSM },
  settingBadgeText: { fontSize: SIZES.fontXS, color: COLORS.accent, fontWeight: '600' },
  
  // App Info
  appInfo: { alignItems: 'center', marginTop: SIZES.padding3XL, paddingBottom: SIZES.paddingXXL },
  appName: { fontSize: SIZES.fontLG, fontWeight: '300', color: COLORS.textMuted, letterSpacing: 4 },
  appVersion: { fontSize: SIZES.fontSM, color: COLORS.textDim, marginTop: SIZES.paddingXS },
  
  bottomPadding: { height: 20 },
});

export default ProfileScreen;
