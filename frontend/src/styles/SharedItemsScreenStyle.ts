import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const sharedItemsStyles = StyleSheet.create({
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

  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
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

  searchArea: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  searchInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.textPrimary,
  },

  searchClearButton: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.lightGreenBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchClearText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },

  grid: {
    padding: 16,
    paddingBottom: 80,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.error,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textMuted,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  fabText: {
    color: colors.textLight,
    fontSize: 28,
    lineHeight: 32,
  },

  loadingIndicator: {
    marginTop: 40,
  },
});
