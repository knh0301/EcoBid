import React from 'react';
import {Text, View} from 'react-native';
import {styles} from '../styles/commonStyles';

export function Message({
  type,
  text,
}: {
  type: 'sent' | 'received';
  text: string;
}) {
  return (
    <View style={[styles.messageRow, type === 'sent' && styles.messageRowSent]}>
      <View style={[styles.messageBubble, type === 'sent' && styles.messageBubbleSent]}>
        <Text style={type === 'sent' ? styles.sentText : styles.messageText}>{text}</Text>
      </View>
    </View>
  );
}