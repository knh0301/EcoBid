import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const chatDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backBtn: {
    padding: 5,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  headerRightSpace: {
    width: 28,
  },

  productBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  productImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  productInfo: {
    justifyContent: 'center',
  },

  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 14,
    color: colors.textMuted,
  },

  keyboardView: {
    flex: 1,
  },

  chatContent: {
    flexGrow: 1,
    padding: 20,
  },

  receivedMessageWrapper: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  receivedBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },

  receivedText: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  sentMessageWrapper: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  sentBubble: {
    backgroundColor: colors.chatGreen,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '80%',
  },

  sentText: {
    fontSize: 16,
    color: colors.textLight,
  },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },

  textInput: {
    flex: 1,
    height: 50,
    backgroundColor: colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  sendButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.primaryDarkest,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
});