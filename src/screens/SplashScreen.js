import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES, GRADIENTS } from '../constants/theme';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dotAnims = useRef([...Array(3)].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();

    // Dot animations
    const dotAnimations = dotAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 500, delay: i * 200, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ])
      )
    );
    dotAnimations.forEach(a => a.start());

    // Navigate after delay
    const timer = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => {
      clearTimeout(timer);
      dotAnimations.forEach(a => a.stop());
    };
  }, []);

  return (
    <LinearGradient colors={GRADIENTS.splash} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Logo */}
      <Animated.View 
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
          style={styles.logoCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Glacier Icon */}
          <View style={styles.iconOuter}>
            <View style={styles.iconInner} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Title */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        GLACIER
      </Animated.Text>

      {/* Loading Dots */}
      <View style={styles.dotsContainer}>
        {dotAnims.map((anim, i) => (
          <Animated.View 
            key={i}
            style={[
              styles.dot,
              { opacity: anim, transform: [{ scale: anim }] }
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 10,
  },
  iconOuter: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(100, 180, 200, 0.6)',
  },
  title: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.white,
    letterSpacing: 12,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default SplashScreen;
