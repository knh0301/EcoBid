import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayBackground,
  },

  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  attendanceDoneCard: {
    backgroundColor: colors.lightGreenBackground,
    borderWidth: 1,
    borderColor: colors.historyBorder,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },

  cardSubText: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
    lineHeight: 18,
  },

  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  attendanceLeft: {
    flex: 1,
    paddingRight: 12,
  },

  stampButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stampButtonDone: {
    backgroundColor: colors.primaryDark,
  },

  stampText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },

  stampRewardText: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '900',
  },

  stampSubText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  creditTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  creditAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  creditAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },

  creditUnit: {
    fontSize: 14,
    color: colors.textPrimary,
  },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '600',
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  outlineButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  rankList: {
    marginTop: 12,
  },

  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.rankBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },

  rankItemFirst: {
    backgroundColor: colors.rankFirstBackground,
  },

  rankNumber: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 12,
    color: colors.textPrimary,
    width: 16,
  },

  rankDept: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },

  rankCredit: {
    fontSize: 12,
    color: colors.textMuted,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },

  seeAll: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
  },

  missionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  missionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  missionTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 6,
  },

  missionDesc: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 8,
    lineHeight: 16,
  },

  missionCredit: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  missionButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },

  missionButtonText: {
    color: colors.textLight,
    fontSize: 11,
  },

  partnerBannerList: {
    gap: 12,
    marginBottom: 24,
  },

  partnerBanner: {
    height: 82,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },

  partnerBannerCircle: {
    position: 'absolute',
    right: -20,
    top: -26,
    width: 82,
    height: 82,
    borderRadius: 41,
    opacity: 0.16,
  },

  partnerBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  partnerBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },

  partnerAdText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 0,
  },

  partnerBannerBody: {
    flex: 1,
    minWidth: 0,
  },

  partnerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  partnerLogoText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '900',
  },

  partnerBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
  },

  partnerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.textPrimary,
    lineHeight: 19,
  },

  partnerCta: {
    minHeight: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  partnerCtaText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.textLight,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },

  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },

  loadingIndicator: {
    marginTop: 20,
  },

  inlineLoadingIndicator: {
    marginTop: 12,
    marginBottom: 4,
  },
});
