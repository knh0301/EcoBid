import {StyleSheet} from 'react-native';

const GREEN = '#79AD6F';
const DARK_GREEN = '#2F6F3E';
const LIGHT_GREEN = '#C9D8C1';
const PAGE_BG = '#F7F9F6';

export const profileEditStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  header: {
    height: 52,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#222222',
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 40,
  },

  editCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LIGHT_GREEN,
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
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
    marginBottom: 6,
  },

  input: {
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#222222',
    backgroundColor: '#FFFFFF',
  },

  disabledInput: {
    backgroundColor: '#EFEFEF',
    color: '#777777',
  },

  selectBox: {
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectText: {
    fontSize: 13,
    color: '#222222',
  },

  submitButton: {
    height: 46,
    borderRadius: 8,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  submitButtonText: {
    color: '#FFFFFF',
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
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  menuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  modalBox: {
    width: '100%',
    minHeight: 116,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 22,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#222222',
    textAlign: 'center',
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 11,
    color: '#777777',
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
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneButton: {
    width: 120,
    height: 34,
    borderRadius: 8,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  modalCancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#777777',
  },

  modalConfirmText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});