import {StyleSheet} from 'react-native';

const GREEN = '#2F6F3E';
const LIGHT_GREEN = '#79AD6F';
const PAGE_BG = '#F7F9F6';

export const creditHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  header: {
    height: 58,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    position: 'relative',
  },

  backButton: {
    zIndex: 2,
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#222222',
  },

  creditBadge: {
    minWidth: 92,
    height: 30,
    borderRadius: 15,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginLeft: 'auto',
    zIndex: 2,
  },

  creditBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  controlRow: {
    height: 46,
    backgroundColor: PAGE_BG,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  monthText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#333333',
    marginRight: 4,
  },

  filterButton: {
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
  },

  dateGroup: {
    marginBottom: 20,
  },

  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A9A9A',
    marginBottom: 8,
  },

  historyItem: {
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C9D8C1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  historyTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#333333',
    marginRight: 12,
  },

  historyAmount: {
    fontSize: 14,
    fontWeight: '900',
  },

  earnAmount: {
    color: GREEN,
  },

  useAmount: {
    color: GREEN,
  },

  emptyBox: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },

  dateSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 34,
    paddingTop: 42,
    paddingBottom: 34,
  },

  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  datePickerGroup: {
    alignItems: 'center',
  },

  dateValueBox: {
    minWidth: 78,
    borderBottomWidth: 1,
    borderBottomColor: '#777777',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    marginVertical: 4,
  },

  monthValueBox: {
  minWidth: 42,
},

  dateValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333333',
    marginRight: 4,
  },

  dateUnit: {
    fontSize: 26,
    fontWeight: '900',
    color: '#333333',
    marginHorizontal: 12,
  },

  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
    marginTop: 28,
  },

  cancelButton: {
    width: 112,
    height: 42,
    borderRadius: 9,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButton: {
    width: 112,
    height: 42,
    borderRadius: 9,
    backgroundColor: LIGHT_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#777777',
  },

  confirmButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  filterSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 42,
    paddingTop: 36,
    paddingBottom: 34,
  },

  filterOption: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  filterOptionText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#333333',
  },
});