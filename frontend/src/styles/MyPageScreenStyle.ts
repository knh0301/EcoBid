import {StyleSheet} from 'react-native';

const GREEN = '#2F6F3E';
const LIGHT_GREEN = '#C9D8C1';
const CARD_BG = '#FFFFFF';
const PAGE_BG = '#F7F9F6';

export const myPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  topHeader: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  headerLogo: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111111',
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 32,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2B2B2B',
    marginBottom: 12,
  },

  profileCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LIGHT_GREEN,
    paddingHorizontal: 18,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 14,
  },

  profileImageOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#95B9EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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

  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333333',
    marginTop: 4,
  },

  userInfo: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 6,
    marginBottom: 16,
  },

  levelArea: {
    width: '100%',
  },

  levelLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333333',
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
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
    marginRight: 12,
  },

  progressFill: {
    width: '45%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: GREEN,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: GREEN,
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
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LIGHT_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: GREEN,
    marginTop: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '700',
    marginTop: 2,
  },

  badgeCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LIGHT_GREEN,
    padding: 18,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#222222',
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
    backgroundColor: '#D8EDC2',
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
    color: GREEN,
    textAlign: 'center',
    marginBottom: 2,
  },

  badgeDesc: {
    height: 14,
    fontSize: 5.5,
    lineHeight: 7,
    color: '#52724D',
    textAlign: 'center',
  },

  activityTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#222222',
    marginBottom: 10,
  },

  activityList: {
    gap: 8,
  },

  activityItem: {
    minHeight: 48,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LIGHT_GREEN,
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
    color: '#333333',
    marginRight: 10,
  },

  activityCredit: {
    fontSize: 14,
    fontWeight: '900',
  },

  plusCredit: {
    color: GREEN,
  },

  minusCredit: {
    color: GREEN,
  },
});