import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const creditHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },

  header: {
    height: 58,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.textDark,
  },

  creditBadge: {
    minWidth: 92,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginLeft: 'auto',
    zIndex: 2,
  },

  creditBadgeText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '800',
  },

  controlRow: {
    height: 46,
    backgroundColor: colors.pageBackground,
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
    color: colors.textDark,
    marginRight: 4,
  },

  filterButton: {
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
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
    color: colors.textDisabled,
    marginBottom: 8,
  },

  historyItem: {
    minHeight: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.historyBorder,
    backgroundColor: colors.white,
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
    color: colors.textDark,
    marginRight: 12,
  },

  historyAmount: {
    fontSize: 14,
    fontWeight: '900',
  },

  earnAmount: {
    color: colors.primaryDark,
  },

  useAmount: {
    color: colors.primaryDark,
  },

  emptyBox: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end',
  },

  dateSheet: {
    backgroundColor: colors.white,
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
    borderBottomColor: colors.textTertiary,
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
    color: colors.textDark,
    marginRight: 4,
  },

  dateUnit: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textDark,
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
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButton: {
    width: 112,
    height: 42,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textTertiary,
  },

  confirmButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textLight,
  },

  filterSheet: {
    backgroundColor: colors.white,
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
    color: colors.textDark,
  },
});