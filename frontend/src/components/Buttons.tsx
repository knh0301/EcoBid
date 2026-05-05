import React from 'react';
import {Pressable, Text, TouchableOpacity} from 'react-native';
import {styles} from '../styles/commonStyles';

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.primaryBtn} onPress={onPress}>
      <Text style={styles.primaryBtnText}>{title}</Text>
    </Pressable>
  );
}

export function OutlineButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.outlineBtn} onPress={onPress}>
      <Text style={styles.outlineBtnText}>{title}</Text>
    </Pressable>
  );
}

export function SocialButton({title}: {title: string}) {
  return (
    <Pressable style={styles.socialBtn}>
      <Text style={styles.socialBtnText}>{title}</Text>
    </Pressable>
  );
}

interface AlertConfirmButtonProps {
  onPress: () => void;
  label?: string;
}

export const AlertConfirmButton: React.FC<AlertConfirmButtonProps> = ({
  onPress,
  label = '확인',
}) => {
  return (
    <TouchableOpacity style={styles.alertConfirmButton} onPress={onPress}>
      <Text style={styles.alertConfirmText}>{label}</Text>
    </TouchableOpacity>
  );
};
