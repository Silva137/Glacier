import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../constants/theme';

const APP_VERSION = '1.0.0';
const SUPPORT_EMAIL = 'support@glacierapp.com';

const HelpSupportModal = ({ visible, onClose }) => {

  const handleContactUs = () => {
    const email = SUPPORT_EMAIL;
    const subject = 'Glacier App Support';
    const body = `\n\n\n---\nApp Version: ${APP_VERSION}\nPlatform: Android`;
    
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .catch(() => {
        Alert.alert(
          'Contact Us',
          `Send us an email at:\n${SUPPORT_EMAIL}`,
          [{ text: 'OK' }]
        );
      });
  };

  const handleReportBug = () => {
    const email = SUPPORT_EMAIL;
    const subject = 'Bug Report - Glacier App';
    const body = `Please describe the bug:\n\n\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behavior:\n\n\n---\nApp Version: ${APP_VERSION}\nPlatform: Android`;
    
    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
      .catch(() => {
        Alert.alert(
          'Report a Bug',
          `Send bug reports to:\n${SUPPORT_EMAIL}`,
          [{ text: 'OK' }]
        );
      });
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Glacier',
      'Thanks for your support! Rating will be available once the app is published on the Play Store.',
      [{ text: 'OK' }]
    );
    // When published, use:
    // Linking.openURL('market://details?id=com.glacier');
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'By using Glacier, you agree to:\n\n• Use the app for personal, non-commercial purposes\n• Not distribute copyrighted content\n• Respect other users and the community\n• Not attempt to reverse engineer the app\n\nFull terms of service coming soon.',
      [{ text: 'OK' }]
    );
  };

  const faqItems = [
    {
      question: 'How do I download tracks for offline listening?',
      answer: 'Tap the download icon on any track in the player screen. Free users can download up to 3 tracks. Upgrade to Premium for unlimited downloads.',
    },
    {
      question: 'How does the sleep timer work?',
      answer: 'Go to Profile → Sleep Timer and select a duration. The music will automatically stop after the selected time.',
    },
    {
      question: 'How do I create a playlist?',
      answer: 'Go to Library → Playlists tab and tap "Create Playlist". Give it a name and start adding your favorite tracks.',
    },
    {
      question: 'What\'s included in Premium?',
      answer: 'Premium includes: ad-free listening, unlimited downloads, exclusive content, early access to new releases, and cloud sync across devices.',
    },
    {
      question: 'How do I cancel Premium?',
      answer: 'You can manage your subscription through your device\'s app store settings. Go to Profile to see your current plan status.',
    },
  ];

  const [expandedFaq, setExpandedFaq] = React.useState(null);

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
            <Text style={styles.title}>Help & Support</Text>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              {/* Quick Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Get Help</Text>
                
                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handleContactUs}
                >
                  <View style={styles.actionInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: COLORS.primaryDim }]}>
                      <Icon name="mail-outline" size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionLabel}>Contact Us</Text>
                      <Text style={styles.actionDescription}>Get help via email</Text>
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handleReportBug}
                >
                  <View style={styles.actionInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: COLORS.errorDim }]}>
                      <Icon name="bug-outline" size={20} color={COLORS.error} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionLabel}>Report a Bug</Text>
                      <Text style={styles.actionDescription}>Help us improve</Text>
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handleRateApp}
                >
                  <View style={styles.actionInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: COLORS.accentDim }]}>
                      <Icon name="star-outline" size={20} color={COLORS.accent} />
                    </View>
                    <View style={styles.actionText}>
                      <Text style={styles.actionLabel}>Rate the App</Text>
                      <Text style={styles.actionDescription}>Share your feedback</Text>
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>
              </View>

              {/* FAQ */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                
                {faqItems.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.faqItem}
                    onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{item.question}</Text>
                      <Icon 
                        name={expandedFaq === index ? 'chevron-up' : 'chevron-down'} 
                        size={20} 
                        color={COLORS.textMuted} 
                      />
                    </View>
                    {expandedFaq === index && (
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Legal */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Legal</Text>
                
                <TouchableOpacity 
                  style={styles.actionRow}
                  onPress={handleTermsOfService}
                >
                  <View style={styles.actionInfo}>
                    <Icon name="document-text-outline" size={22} color={COLORS.textMuted} />
                    <Text style={styles.actionLabel}>Terms of Service</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={COLORS.textDim} />
                </TouchableOpacity>
              </View>

              {/* App Info */}
              <View style={styles.appInfoSection}>
                <Text style={styles.appName}>Glacier</Text>
                <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
                <Text style={styles.copyright}>© 2024 Glacier. All rights reserved.</Text>
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
    maxHeight: '90%',
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
  scrollView: {
    maxHeight: 500,
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SIZES.paddingMD,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusMD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
  },
  actionDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  faqItem: {
    paddingVertical: SIZES.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
    flex: 1,
    paddingRight: SIZES.paddingMD,
  },
  faqAnswer: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: SIZES.paddingMD,
    lineHeight: 20,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingTop: SIZES.paddingXXL,
    paddingBottom: SIZES.paddingLG,
  },
  appName: {
    fontSize: SIZES.fontLG,
    fontWeight: '300',
    color: COLORS.textMuted,
    letterSpacing: 4,
  },
  appVersion: {
    fontSize: SIZES.fontSM,
    color: COLORS.textDim,
    marginTop: SIZES.paddingXS,
  },
  copyright: {
    fontSize: SIZES.fontXS,
    color: COLORS.textDim,
    marginTop: SIZES.paddingMD,
  },
});

export default HelpSupportModal;
