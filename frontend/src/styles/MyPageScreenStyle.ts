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
    backgroundColor: colors.profileBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  profileImageInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.profileGold,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileEmoji: {
    fontSize: 42,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.profileBorder,
    padding: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textDark,
    marginBottom: 14,
  },

  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },

  badgeItem: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: colors.badgeBackground,
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 6,
  },

  badgeEmoji: {
    height: 26,
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 2,
  },

  badgeTitle: {
    height: 14,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 2,
  },

  badgeDesc: {
    height: 14,
    fontSize: 5.5,
    lineHeight: 7,
    color: colors.badgeText,
    textAlign: 'center',
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
});