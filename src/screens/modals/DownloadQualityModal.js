import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES } from '../../constants/theme';
import { DOWNLOAD_QUALITY_OPTIONS } from '../../constants/data';
import { usePlayer } from '../../hooks/usePlayer';

const DownloadQualityModal = ({ visible, onClose }) => {
  const { downloadQuality, setDownloadQuality } = usePlayer();

  const handleSelect = (quality) => {
    setDownloadQuality(quality);
    onClose();
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
            <Text style={styles.title}>Download Quality</Text>

            <View style={styles.options}>
              {DOWNLOAD_QUALITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    downloadQuality === option.id && styles.optionSelected
                  ]}
                  onPress={() => handleSelect(option.id)}
                >
                  <View style={styles.optionInfo}>
                    <Text style={[
                      styles.optionLabel,
                      downloadQuality === option.id && styles.optionLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  <Text style={styles.optionSize}>{option.size}</Text>
                </TouchableOpacity>
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
  options: { gap: SIZES.paddingSM },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  optionInfo: { flex: 1 },
  optionLabel: {
    fontSize: SIZES.fontLG,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  optionLabelSelected: {
    color: COLORS.accent,
  },
  optionDescription: {
    fontSize: SIZES.fontSM,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  optionSize: {
    fontSize: SIZES.fontSM,
    color: COLORS.textDim,
  },
});

export default DownloadQualityModal;
