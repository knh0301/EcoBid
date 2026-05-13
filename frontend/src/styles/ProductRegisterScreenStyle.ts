import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const productRegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayBackground,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.grayBackground,
  },

  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  headerRightSpace: {
    width: 24,
  },

  content: {
    padding: 16,
  },

  imagePicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },

  addImageBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.lightGrayBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addImagePlus: {
    fontSize: 22,
    color: colors.textMuted,
  },

  addImageCount: {
    fontSize: 12,
    color: colors.textMuted,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 20,
  },

  priceInput: {
    flex: 1,
    marginBottom: 0,
  },

  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
  },

  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  categoryChipText: {
    fontSize: 13,
    color: colors.textPrimary,
  },

  categoryChipTextSelected: {
    color: colors.textLight,
    fontWeight: 'bold',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 0,
  },

  creditUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  descriptionLabel: {
    marginTop: 20,
  },

  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 140,
  },

  spacer: {
    height: 100,
  },

  bottomBar: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: colors.grayBackground,
  },

  submitButtonFull: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  editButtonRow: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: colors.grayBackground,
  },

  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    alignItems: 'center',
  },

  deleteButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  submitButton: {
    flex: 3,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  submitButtonText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
});