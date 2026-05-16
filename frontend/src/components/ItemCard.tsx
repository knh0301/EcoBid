import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {itemCardStyles as styles} from '../styles/ItemCardStyle';
import {colors} from '../styles/colors';

type ItemCardProps = {
  title: string;
  price: string;
  icon: string;
  backgroundColor: string;
  imageUrl?: string;
  isLiked?: boolean;
  showHeart?: boolean;
  onPress?: () => void;
  onHeartPress?: () => void;
};

export function ItemCard({
  title,
  price,
  icon,
  backgroundColor,
  imageUrl,
  isLiked = true,
  showHeart = true,
  onPress,
  onHeartPress,
}: ItemCardProps) {
  return (
    <Pressable style={styles.itemCard} onPress={onPress}>
      <View style={[styles.itemImage, {backgroundColor}]}>
        {imageUrl ? (
          <Image
            source={{uri: imageUrl}}
            style={styles.itemPhoto}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.itemIcon}>{icon}</Text>
        )}
      </View>

      <View style={styles.itemInfoRow}>
        <View style={styles.itemTextBox}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.itemPrice}>{price}</Text>
        </View>

        {showHeart && (
          <Pressable
            hitSlop={8}
            style={styles.heartButton}
            onPress={onHeartPress}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={isLiked ? colors.heart : '#999999'}
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}
