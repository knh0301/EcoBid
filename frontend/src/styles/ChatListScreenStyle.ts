import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const chatListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  topHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackground,
  },

  headerLogo: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },

  titleHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackground,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textDark,
  },

  scrollContent: {
    flexGrow: 1,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBackground,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },

  avatarPhoto: {
    width: '100%',
    height: '100%',
  },

  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },

  lastMessage: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '400',
  },
});
