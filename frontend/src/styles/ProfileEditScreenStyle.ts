import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const profileEditStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },

  header: {
    height: 52,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.textDark,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 40,
  },

  editCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.historyBorder,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 14,
  },

  profileImageArea: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    marginBottom: 20,
  },

  profileImageOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#95B9EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImageInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D0B100',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileEmoji: {
    fontSize: 42,
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 8,
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
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },

  input: {
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.textDark,
    backgroundColor: colors.white,
  },

  disabledInput: {
    backgroundColor: '#EFEFEF',
    color: colors.textTertiary,
  },

  selectBox: {
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectText: {
    fontSize: 13,
    color: colors.textDark,
  },

  submitButton: {
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  submitButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '900',
  },

  menuList: {
    gap: 8,
  },

  menuItem: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  modalBox: {
    width: '100%',
    minHeight: 116,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 22,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: 14,
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 6,
  },

  modalCancelButton: {
    width: 74,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalConfirmButton: {
    width: 74,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneButton: {
    width: 120,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  modalCancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textTertiary,
  },

  modalConfirmText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.textLight,
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
    color: colors.textSecondary,
  },
});