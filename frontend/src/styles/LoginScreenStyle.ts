import {StyleSheet} from 'react-native';

const GREEN = '#79AD6F';
const DARK_GREEN = '#2F6F3E';
const PAGE_BG = '#F7F9F6';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 24,
    paddingVertical: 34,
    alignItems: 'center',
  },

  logoBox: {
    width: 66,
    height: 66,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 3,
  },

  title: {
    fontSize: 27,
    fontWeight: '900',
    color: '#222222',
    marginBottom: 24,
  },

  inputGroup: {
    width: '100%',
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    height: 44,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#222222',
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
    color: '#888888',
  },

  findPasswordLink: {
    fontSize: 11,
    color: DARK_GREEN,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },

  loginButton: {
    width: '100%',
    height: 46,
    borderRadius: 9,
    backgroundColor: GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  dividerText: {
    marginVertical: 20,
    fontSize: 13,
    color: '#777777',
  },

  googleButton: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },

  googleIcon: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
    marginRight: 10,
  },

  googleButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333333',
  },

  signupRow: {
    flexDirection: 'row',
    marginTop: 22,
    alignItems: 'center',
  },

  signupText: {
    fontSize: 11,
    color: '#777777',
  },

  signupLink: {
    fontSize: 11,
    color: DARK_GREEN,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});