import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const myPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },

  topHeader: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerLogo: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.cardTitle,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 32,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.pageTitleDark,
    marginBottom: 12,
  },

  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 14,
  },

  profileImageOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  profileImageInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.profileGold,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileEmoji: {
    fontSize: 42,
  },

  profilePhoto: {
    width: '100%',
    height: '100%',
  },

  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textDark,
    marginTop: 4,
  },

  userInfo: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 6,
    marginBottom: 16,
  },

  levelArea: {
    width: '100%',
  },

  levelLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.gray200,
    overflow: 'hidden',
    marginRight: 12,
  },

  progressFill: {
    width: '45%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.primaryDark,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    height: 92,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: colors.textDark,
    fontWeight: '700',
    marginTop: 2,
  },

  badgeCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    marginBottom: 14,
  },

  badgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textDark,
  },

  badgeCountPill: {
    minWidth: 42,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lightGreenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  badgeCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.primaryDark,
  },

  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },

  badgeItem: {
    width: '23%',
    alignItems: 'center',
    minHeight: 70,
  },

  badgeItemLocked: {
    opacity: 0.72,
  },

  badgeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  badgeTitle: {
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '900',
    color: colors.textDark,
    textAlign: 'center',
  },

  badgeTitleLocked: {
    color: colors.textMuted,
  },

  activityTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textDark,
    marginBottom: 10,
  },

  activityList: {
    gap: 8,
  },

  activityItem: {
    minHeight: 48,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  activityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginRight: 10,
  },

  activityCredit: {
    fontSize: 14,
    fontWeight: '900',
  },

  plusCredit: {
    color: colors.primaryDark,
  },

  minusCredit: {
    color: colors.primaryDark,
  },

  badgeModalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  badgeModalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
  },

  badgeModalIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  badgeModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },

  badgeModalDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },

  badgeModalStatus: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 18,
  },

  badgeModalStatusAwarded: {
    color: colors.primaryDark,
  },

  badgeModalStatusLocked: {
    color: colors.textMuted,
  },

  badgeModalButton: {
    minWidth: 96,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  badgeModalButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.white,
  },
});
