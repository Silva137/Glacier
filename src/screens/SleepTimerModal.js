import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, GRADIENTS } from '../../constants/theme';
import { SLEEP_TIMER_OPTIONS } from '../../constants/data';
import { usePlayer } from '../../hooks/usePlayer';

const SleepTimerModal = ({ visible, onClose }) => {
  const [customTime, setCustomTime] = useState(30);
  const [showSlider, setShowSlider] = useState(false);
  const { sleepTimer, sleepTimerActive, setSleepTimerValue, cancelSleepTimer } = usePlayer();

  const handleSelectOption = (value) => {
    if (value === 'custom') {
      setShowSlider(true);
    } else {
      setSleepTimerValue(value);
      onClose();
    }
  };

  const handleSetCustom = () => {
    setSleepTimerValue(customTime);
    setShowSlider(false);
    onClose();
  };

  const handleTurnOff = () => {
    cancelSleepTimer();
    onClose();
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
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
            <Text style={styles.title}>Sleep Timer</Text>

            {!showSlider ? (
              <>
                {/* Quick Options */}
                <View style={styles.options}>
                  {SLEEP_TIMER_OPTIONS.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.option,
                        sleepTimer === option.value && sleepTimerActive && styles.optionSelected
                      ]}
                      onPress={() => handleSelectOption(option.value)}
                    >
                      <Text style={[
                        styles.optionText,
                        sleepTimer === option.value && sleepTimerActive && styles.optionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Custom Option */}
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setShowSlider(true)}
                  >
                    <Text style={styles.optionText}>Custom time...</Text>
                  </TouchableOpacity>
                </View>

                {/* Turn Off */}
                {sleepTimerActive && (
                  <TouchableOpacity 
                    style={styles.turnOffButton}
                    onPress={handleTurnOff}
                  >
                    <Text style={styles.turnOffText}>Turn Off Timer</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {/* Slider View */}
                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderValue}>{formatTime(customTime)}</Text>
                  
                  <View style={styles.sliderWrapper}>
                    <Text style={styles.sliderLabel}>5m</Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={5}
                      maximumValue={180}
                      step={5}
                      value={customTime}
                      onValueChange={setCustomTime}
                      minimumTrackTintColor={COLORS.accent}
                      maximumTrackTintColor={COLORS.surface}
                      thumbTintColor={COLORS.accent}
                    />
                    <Text style={styles.sliderLabel}>3h</Text>
                  </View>

                  {/* Quick select buttons */}
                  <View style={styles.quickSelect}>
                    {[15, 30, 45, 60, 90, 120].map(mins => (
                      <TouchableOpacity
                        key={mins}
                        style={[
                          styles.quickSelectButton,
                          customTime === mins && styles.quickSelectButtonActive
                        ]}
                        onPress={() => setCustomTime(mins)}
                      >
                        <Text style={[
                          styles.quickSelectText,
                          customTime === mins && styles.quickSelectTextActive
                        ]}>
                          {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.sliderActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowSlider(false)}
                  >
                    <Text style={styles.cancelButtonText}>Back</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={handleSetCustom}
                  >
                    <LinearGradient
                      colors={GRADIENTS.button}
                      style={styles.confirmButtonGradient}
                    >
                      <Text style={styles.confirmButtonText}>Set Timer</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  options: { gap: SIZES.paddingSM },
  option: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: SIZES.radiusLG,
    paddingVertical: SIZES.paddingLG,
    paddingHorizontal: SIZES.paddingXL,
  },
  optionSelected: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accentBorder,
  },
  optionText: {
    fontSize: SIZES.fontLG,
    color: COLORS.textPrimary,
  },
  optionTextSelected: {
    color: COLORS.accent,
  },
  turnOffButton: {
    backgroundColor: COLORS.errorBg || 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.errorBorder || 'rgba(220, 38, 38, 0.3)',
    borderRadius: SIZES.radiusLG,
    paddingVertical: SIZES.paddingLG,
    paddingHorizontal: SIZES.paddingXL,
    marginTop: SIZES.paddingLG,
  },
  turnOffText: {
    fontSize: SIZES.fontLG,
    color: COLORS.error,
    textAlign: 'center',
  },
  
  // Slider styles
  sliderContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.paddingXXL,
  },
  sliderValue: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.accent,
    marginBottom: SIZES.paddingXXL,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: SIZES.paddingMD,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    width: 30,
  },
  quickSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SIZES.paddingSM,
    marginTop: SIZES.paddingXXL,
  },
  quickSelectButton: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMD,
    paddingVertical: SIZES.paddingSM,
    paddingHorizontal: SIZES.paddingLG,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  quickSelectButtonActive: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accentBorder,
  },
  quickSelectText: {
    fontSize: SIZES.fontMD,
    color: COLORS.textMuted,
  },
  quickSelectTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  sliderActions: {
    flexDirection: 'row',
    gap: SIZES.paddingMD,
    marginTop: SIZES.paddingXXL,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLG,
    paddingVertical: SIZES.paddingLG,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: SIZES.fontLG,
    color: COLORS.textMuted,
  },
  confirmButton: {
    flex: 2,
    borderRadius: SIZES.radiusLG,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: SIZES.paddingLG,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default SleepTimerModal;
