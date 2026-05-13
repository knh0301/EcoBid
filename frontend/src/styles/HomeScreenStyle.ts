import {StyleSheet} from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  cardSubText: {
    fontSize: 12,
    color: '#888888',
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
    backgroundColor: '#5C8B5A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stampText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
    color: '#5C8B5A',
  },

  creditUnit: {
    fontSize: 14,
    color: '#1A1A1A',
  },

  primaryButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: '#5C8B5A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },

  outlineButtonText: {
    color: '#5C8B5A',
    fontSize: 15,
    fontWeight: '600',
  },

  rankList: {
    marginTop: 12,
  },

  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF8EC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },

  rankItemFirst: {
    backgroundColor: '#EDE0C4',
  },

  rankNumber: {
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 12,
    color: '#1A1A1A',
    width: 16,
  },

  rankDept: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },

  rankCredit: {
    fontSize: 12,
    color: '#888888',
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
    color: '#1A1A1A',
    marginBottom: 12,
  },

  seeAll: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 12,
  },

  missionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  missionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  missionTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#1A1A1A',
    marginBottom: 6,
  },

  missionDesc: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 8,
    lineHeight: 16,
  },

  missionCredit: {
    fontSize: 11,
    color: '#5C8B5A',
    fontWeight: 'bold',
    marginBottom: 8,
  },

  missionButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },

  missionButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  productCard: {
    width: '47%',
  },

  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'flex-end',
    padding: 8,
  },

  productImageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },

  productPrice: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  errorText: {
    color: '#FF5252',
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
    color: '#888888',
    fontSize: 14,
  },

  productHeart: {
    fontSize: 18,
    color: '#CCCCCC',
  },

  loadingIndicator: {
    marginTop: 20,
  },
});