import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const passwordResetStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 24,
    paddingVertical: 34,
    alignItems: 'center',
  },

  logoBox: {
    width: 66,
    height: 66,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textDark,
    marginBottom: 24,
  },

  inputGroup: {
    width: '100%',
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },

  input: {
    width: '100%',
    height: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 13,
    color: colors.textDark,
  },

  primaryButton: {
    width: '100%',
    height: 46,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '900',
  },

  secondaryButton: {
    height: 42,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    textDecorationLine: 'underline',
  },

  loginLinkButton: {
    marginTop: 20,
    paddingVertical: 8,
  },

  loginLinkText: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
