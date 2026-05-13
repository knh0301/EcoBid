import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const BOX_SIZE = (width - 55) / 2;

export const missionVerifyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backBtn: {
    padding: 5,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    zIndex: 1,
  },

  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },

  section: {
    marginTop: 10,
  },

  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },

  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    height: 180,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  textInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },

  footer: {
    padding: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  creditText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C8B5A',
    textAlign: 'right',
    marginBottom: 15,
  },

  submitButton: {
    backgroundColor: '#86B27A',
    borderRadius: 14,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },

  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: '#86B27A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },

  modalBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});