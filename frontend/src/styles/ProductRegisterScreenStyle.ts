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
    marginBottom: 12,
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

  imagePreviewBox: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.lightGrayBackground,
  },

  imagePreview: {
    width: '100%',
    height: '100%',
  },

  imageChangeBadge: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageChangeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },

  imageRemoveButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageRemoveText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '800',
  },

  aiDraftButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8D8C0',
    backgroundColor: '#F7FBF4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },

  aiDraftButtonDisabled: {
    opacity: 0.55,
  },

  aiDraftButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
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
