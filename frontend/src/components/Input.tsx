import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {styles} from '../styles/commonStyles';

export function Input({
  label,
  placeholder,
  secure,
}: {
  label: string;
  placeholder: string;
  secure?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secure}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}