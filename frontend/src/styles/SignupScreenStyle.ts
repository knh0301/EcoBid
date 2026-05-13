import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const signupStyles = StyleSheet.create({
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
    paddingVertical: 26,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 18,
  },

  profileArea: {
    alignSelf: 'center',
    width: 78,
    height: 78,
    marginBottom: 14,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputGroup: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 5,
  },

  input: {
    height: 42,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 13,
    color: colors.textDark,
  },

  selectBox: {
    height: 42,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectText: {
    fontSize: 13,
    color: colors.textDark,
  },

  placeholderText: {
    color: '#999999',
  },

  signupButton: {
    height: 46,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  signupButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '900',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  loginText: {
    fontSize: 11,
    color: colors.textTertiary,
  },

  loginLink: {
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  departmentSheet: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
  },

  departmentSheetTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 14,
  },

  departmentOption: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  departmentOptionSelected: {
    backgroundColor: '#F0F6EE',
  },

  departmentOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },

  departmentOptionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '900',
  },

  departmentCancelButton: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  departmentCancelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#555555',
  },
});