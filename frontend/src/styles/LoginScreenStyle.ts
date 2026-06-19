import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 34,
  },

  card: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingVertical: 22,
    alignItems: 'center',
  },

  logoBox: {
    width: 82,
    height: 82,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.textDark,
    marginBottom: 34,
  },

  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textDark,
  },

  findPasswordRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 22,
  },

  findPasswordText: {
    fontSize: 13,
    color: colors.textMuted,
  },

  findPasswordLink: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  loginButton: {
    width: '100%',
    height: 58,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: '900',
  },

  dividerText: {
    marginVertical: 20,
    fontSize: 13,
    color: colors.textTertiary,
  },

  googleButton: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 3,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },

  googleIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.googleBlue,
    marginRight: 10,
  },

  googleButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
  },

  signupRow: {
    flexDirection: 'row',
    marginTop: 28,
    alignItems: 'center',
  },

  signupText: {
    fontSize: 13,
    color: colors.textTertiary,
  },

  signupLink: {
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
