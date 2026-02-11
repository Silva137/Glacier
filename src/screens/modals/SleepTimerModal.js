import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, GRADIENTS } from '../../constants/theme';
import { usePlayer } from '../../hooks/usePlayer';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const ITEM_HEIGHT = 50;
const SWIPE_THRESHOLD = 100;

const NumberPicker = ({ value, onChange, maxValue = 9 }) => {
  const scrollRef = useRef(null);
  
  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, maxValue));
    if (clampedIndex !== value) {
      onChange(clampedIndex);
    }
  };

  const scrollToValue = (val) => {
    scrollRef.current?.scrollTo({ y: val * ITEM_HEIGHT, animated: false });
  };

  React.useEffect(() => {
    setTimeout(() => scrollToValue(value), 50);
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerHighlight} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.pickerContent}
      >
        {DIGITS.slice(0, maxValue + 1).map((digit, index) => (
          <View key={index} style={styles.pickerItem}>
            <Text style={[
              styles.pickerText,
              value === index && styles.pickerTextActive
            ]}>
              {digit}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const SleepTimerModal = ({ visible, onClose }) => {
  const { sleepTimer, sleepTimerActive, setSleepTimerValue, cancelSleepTimer } = usePlayer();
  
  const [digit1, setDigit1] = useState(0);
  const [digit2, setDigit2] = useState(3);
  const [digit3, setDigit3] = useState(0);

  // Swipe to dismiss
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            translateY.setValue(0);
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 10,
          }).start();
        }
      },
    })
  ).current;

  const quickOptions = [
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
  ];

  const handleSelectOption = (value) => {
    setSleepTimerValue(value);
    onClose();
  };

  const handleSetCustom = () => {
    const totalMinutes = digit1 * 100 + digit2 * 10 + digit3;
    if (totalMinutes > 0) {
      setSleepTimerValue(totalMinutes);
      onClose();
    }
  };

  const handleTurnOff = () => {
    cancelSleepTimer();
    onClose();
  };

  const customMinutes = digit1 * 100 + digit2 * 10 + digit3;

  const formatDisplayTime = (mins) => {
    if (mins < 60) return `${mins} minutes`;
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    if (remaining === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${remaining}m`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.sheet,
            { transform: [{ translateY }] }
          ]}
        >
          <LinearGradient
            colors={['#1a3a4a', '#0a1a2a']}
            style={styles.content}
          >
            {/* Swipeable Handle */}
            <View {...panResponder.panHandlers} style={styles.handleArea}>
              <View style={styles.handle} />
              <Text style={styles.handleHint}>Swipe down to close</Text>
            </View>

            <Text style={styles.title}>Sleep Timer</Text>

            {/* Quick Options */}
            <View style={styles.quickOptions}>
              {quickOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.quickOption,
                    sleepTimer === option.value && sleepTimerActive && styles.quickOptionSelected
                  ]}
                  onPress={() => handleSelectOption(option.value)}
                >
                  <Text style={[
                    styles.quickOptionText,
                    sleepTimer === option.value && sleepTimerActive && styles.quickOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Time Picker */}
            <View style={styles.customSection}>
              <Text style={styles.customLabel}>Custom Duration</Text>
              
              <View style={styles.pickerRow}>
                <NumberPicker value={digit1} onChange={setDigit1} maxValue={9} />
                <NumberPicker value={digit2} onChange={setDigit2} maxValue={9} />
                <NumberPicker value={digit3} onChange={setDigit3} maxValue={9} />
                <Text style={styles.pickerUnit}>min</Text>
              </View>

              <Text style={styles.customDisplay}>
                {customMinutes > 0 ? formatDisplayTime(customMinutes) : 'Select duration'}
              </Text>

              <TouchableOpacity 
                style={[styles.setButton, customMinutes === 0 && styles.setButtonDisabled]}
                onPress={handleSetCustom}
                disabled={customMinutes === 0}
              >
                <LinearGradient
                  colors={customMinutes > 0 ? GRADIENTS.button : ['#333', '#222']}
                  style={styles.setButtonGradient}
                >
                  <Text style={styles.setButtonText}>Set Custom Timer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Turn Off */}
            {sleepTimerActive && (
              <TouchableOpacity 
                style={styles.turnOffButton}
                onPress={handleTurnOff}
              >
                <Text style={styles.turnOffText}>Turn Off Timer ({sleepTimer} min active)</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sheet: {
    borderTopLeftRadius: SIZES.radiusXXL,
    borderTopRightRadius: SIZES.radiusXXL,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: SIZES.paddingXXL,
    paddingBottom: 40,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: SIZES.paddingLG,
    paddingBottom: SIZES.paddingMD,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  handleHint: {
    fontSize: 10,
    color: COLORS.textDim,
    marginTop: 6,
  },
  title: {
    fontSize: SIZES.font3XL,
    fontWeight: '300',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.paddingXXL,
  },
  
  // Quick options
  quickOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.paddingSM,
    marginBottom: SIZES.paddingXXL,
  },
  quickOption: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: SIZES.radiusMD,
    paddingVertical: SIZES.paddingMD,
    paddingHorizontal: SIZES.paddingLG,
  },
  quickOptionSelected: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accentBorder,
  },
  quickOptionText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textPrimary,
  },
  quickOptionTextSelected: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  
  // Custom section
  customSection: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    padding: SIZES.paddingXXL,
    alignItems: 'center',
  },
  customLabel: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
    marginBottom: SIZES.paddingLG,
  },
  
  // Number picker
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.paddingSM,
  },
  pickerContainer: {
    width: 50,
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: SIZES.radiusMD,
  },
  pickerHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.accentDim,
    borderRadius: SIZES.radiusSM,
  },
  pickerContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.textDim,
  },
  pickerTextActive: {
    color: COLORS.accent,
    fontWeight: '500',
  },
  pickerUnit: {
    fontSize: SIZES.fontXL,
    color: COLORS.textMuted,
    marginLeft: SIZES.paddingSM,
  },
  customDisplay: {
    fontSize: SIZES.fontLG,
    color: COLORS.textSecondary,
    marginTop: SIZES.paddingLG,
    marginBottom: SIZES.paddingLG,
  },
  setButton: {
    width: '100%',
    borderRadius: SIZES.radiusLG,
    overflow: 'hidden',
  },
  setButtonDisabled: {
    opacity: 0.5,
  },
  setButtonGradient: {
    paddingVertical: SIZES.paddingLG,
    alignItems: 'center',
  },
  setButtonText: {
    fontSize: SIZES.fontMD,
    fontWeight: '600',
    color: COLORS.white,
  },
  
  // Turn off
  turnOffButton: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    borderRadius: SIZES.radiusLG,
    paddingVertical: SIZES.paddingLG,
    paddingHorizontal: SIZES.paddingXL,
    marginTop: SIZES.paddingLG,
  },
  turnOffText: {
    fontSize: SIZES.fontMD,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default SleepTimerModal;
