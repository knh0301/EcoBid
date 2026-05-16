import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const loginStyles = StyleSheet.create({
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
    fontSize: 27,
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

  findPasswordRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 16,
  },

  findPasswordText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  findPasswordLink: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  loginButton: {
    width: '100%',
    height: 46,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: colors.textLight,
    fontSize: 14,
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
    marginTop: 22,
    alignItems: 'center',
  },

  signupText: {
    fontSize: 11,
    color: colors.textTertiary,
  },

  signupLink: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});
