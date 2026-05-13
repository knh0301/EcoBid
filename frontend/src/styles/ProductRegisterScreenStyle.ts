import {StyleSheet} from 'react-native';

export const productRegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },

  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
    borderColor: '#DDDDDD',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addImagePlus: {
    fontSize: 22,
    color: '#888888',
  },

  addImageCount: {
    fontSize: 12,
    color: '#888888',
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A1A',
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
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
  },

  categoryChipSelected: {
    backgroundColor: '#5C8B5A',
    borderColor: '#5C8B5A',
  },

  categoryChipText: {
    fontSize: 13,
    color: '#1A1A1A',
  },

  categoryChipTextSelected: {
    color: '#FFFFFF',
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
    color: '#1A1A1A',
  },

  descriptionLabel: {
    marginTop: 20,
  },

  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: '#1A1A1A',
    minHeight: 140,
  },

  spacer: {
    height: 100,
  },

  bottomBar: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: '#F5F5F5',
  },

  submitButtonFull: {
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  editButtonRow: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#F5F5F5',
  },

  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  deleteButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  submitButton: {
    flex: 3,
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});