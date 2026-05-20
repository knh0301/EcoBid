import {Dimensions, StyleSheet} from 'react-native';
import {colors} from './colors';

const {width} = Dimensions.get('window');
const BOX_SIZE = (width - 55) / 2;

export const missionVerifyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backBtn: {
    padding: 5,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },

  headerRightSpace: {
    width: 28,
  },

  scrollContent: {
    padding: 20,
  },

  gridContainer: {
    marginBottom: 30,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  grayBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    position: 'relative',
  },

  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  removeBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.white,
    borderRadius: 12,
    zIndex: 1,
  },

  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 5,
  },

  section: {
    marginTop: 10,
  },

  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
  },

  inputContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    padding: 16,
    height: 180,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  textInput: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
  },

  footer: {
    padding: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  creditText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 15,
  },

  submitButton: {
    backgroundColor: colors.chatGreen,
    borderRadius: 14,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitButtonDisabled: {
    opacity: 0.55,
  },

  submitText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.black,
    marginBottom: 10,
  },

  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: colors.chatGreen,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },

  modalBtnText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
