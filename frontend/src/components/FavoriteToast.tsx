import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../styles/colors';

type FavoriteToastProps = {
  visible: boolean;
  message: string;
  type: 'liked' | 'unliked';
};

export function FavoriteToast({visible, message, type}: FavoriteToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 180 : 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 14,
        duration: visible ? 180 : 150,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.96,
        friction: 8,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY, visible]);

  if (!visible) {
    return null;
  }

  const isLiked = type === 'liked';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity,
          transform: [{translateY}, {scale}],
        },
      ]}>
      <View style={[styles.iconBox, isLiked ? styles.likedIconBox : styles.unlikedIconBox]}>
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={18}
          color={isLiked ? colors.heart : colors.primary}
        />
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 22,
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 20,
  },

  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  likedIconBox: {
    backgroundColor: '#FFE8E8',
  },

  unlikedIconBox: {
    backgroundColor: colors.lightGreenBackground,
  },

  message: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
});
