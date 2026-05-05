import {StyleSheet} from 'react-native';

export const homeStyles = StyleSheet.create({
  homeScroll: {
  flex: 1,
  backgroundColor: '#F5F5F3',
},

  homeContainer: {
  flexGrow: 1,
  padding: 16,
  paddingBottom: 120,
  backgroundColor: '#F5F5F3',
},

  homeAttendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9D8C1',
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  homeAttendanceTextBox: {
    flex: 1,
    marginRight: 14,
  },

  homeCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2B2B2B',
    marginBottom: 6,
  },

  homeCardDescription: {
    fontSize: 13,
    color: '#6E6E6E',
    lineHeight: 18,
  },

  homeStampCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#79AD6F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },

  homeStampText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  homeCreditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9D8C1',
    padding: 18,
    marginBottom: 14,
  },

  homeCreditTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  homeCreditRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  homeCreditAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#487043',
  },

  homeCreditUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2B2B',
    marginBottom: 4,
  },

  homeCreditButton: {
    backgroundColor: '#79AD6F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },

  homeCreditButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  homeRankingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C9D8C1',
    padding: 16,
    marginBottom: 18,
  },

  homeRankingList: {
    marginTop: 10,
    gap: 7,
  },

  homeRankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  homeRankingItemFirst: {
    backgroundColor: '#ECE6BD',
  },

  homeRankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  homeRankingRank: {
    width: 18,
    fontSize: 13,
    fontWeight: '700',
    color: '#2B2B2B',
  },

  homeRankingDept: {
    fontSize: 13,
    color: '#2B2B2B',
    marginLeft: 8,
  },

  homeRankingCredit: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2B2B2B',
  },

  homeRankingCreditUnit: {
    fontSize: 9,
    fontWeight: '400',
    color: '#7A7A7A',
  },

  homeSectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2B2B2B',
    marginBottom: 12,
  },

//   homeMissionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//     marginBottom: 20,
//   },

  homeMissionScrollContent: {
     paddingRight: 16,
    paddingBottom: 20,
    },

  homeMissionCard: {
  width: 240,
  minHeight: 70,
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#C9D8C1',
  padding: 14,
  marginRight: 12,
},

  homeMissionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2B2B2B',
    marginBottom: 6,
  },

  homeMissionDescription: {
    fontSize: 10,
    color: '#707070',
    lineHeight: 15,
    marginBottom: 12,
  },

  homeMissionBottom: {
    marginTop: 'auto',
  },

  homeMissionReward: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4E7B48',
    marginBottom: 8,
  },

  homeMissionButton: {
  alignSelf: 'flex-end',
  backgroundColor: '#79AD6F',
  borderRadius: 10,
  paddingHorizontal: 18,
  paddingVertical: 9,
},

  homeMissionButtonText: {
  color: '#FFFFFF',
  fontSize: 12,
  fontWeight: '800',
},

  homeSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  homeMoreText: {
    fontSize: 13,
    color: '#8D8D8D',
    fontWeight: '500',
  },

  homeItemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  homeItemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },

  homeItemImagePlaceholder: {
    width: '100%',
    height: 138,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#E9E6DA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  homeItemIcon: {
    fontSize: 58,
  },

  homeItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  homeItemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
  },

  homeItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B2B2B',
  },

  homeHeartButton: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  homeHeartIcon: {
    fontSize: 27,
    color: '#4E7B48',
    fontWeight: '400',
  },
});