import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const missionAdminReviewStyles = StyleSheet.create({
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
  },

  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.textDark,
  },

  headerSpacer: {
    width: 36,
  },

  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },

  tabButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.lightGrayBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabButtonActive: {
    backgroundColor: colors.primaryDark,
  },

  tabButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.textSecondary,
  },

  tabButtonTextActive: {
    color: colors.white,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 10,
  },

  stateBox: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  stateText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  retryButton: {
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.white,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },

  cardTitleArea: {
    flex: 1,
  },

  missionTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    color: colors.textDark,
  },

  userText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
  },

  statusBadge: {
    minHeight: 26,
    borderRadius: 8,
    backgroundColor: colors.rankBackground,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBadgeApproved: {
    backgroundColor: colors.lightGreenBackground,
  },

  statusBadgeRejected: {
    backgroundColor: '#FFECEC',
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#B88700',
  },

  statusBadgeTextApproved: {
    color: colors.primaryDark,
  },

  statusBadgeTextRejected: {
    color: colors.heart,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 10,
  },

  metaText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },

  metaDivider: {
    fontSize: 11,
    color: colors.borderLight,
  },

  contentText: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.textDark,
  },

  emptyContentText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },

  proofImage: {
    width: '100%',
    height: 168,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: colors.lightGrayBackground,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },

  reviewButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rejectButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  approveButton: {
    backgroundColor: colors.primaryDark,
  },

  reviewButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.white,
  },

  rejectButtonText: {
    color: colors.textSecondary,
  },
});
