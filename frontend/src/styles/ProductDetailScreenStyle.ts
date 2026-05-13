import {StyleSheet} from 'react-native';

export const productDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },

  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'center',
  },

  creditBadge: {
    backgroundColor: '#EAF2E9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  creditBadgeText: {
    color: '#5C8B5A',
    fontSize: 12,
    fontWeight: 'bold',
  },

  imageBox: {
    width: 250,
    height: 250,
    backgroundColor: '#F5F5F5',
    marginRight: 2,
  },

  imageText: {
    textAlign: 'center',
    marginTop: 100,
  },

  bodyPadding: {
    padding: 16,
  },

  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  avatarText: {
    fontSize: 20,
  },

  sellerName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  editButton: {
    marginLeft: 'auto',
  },

  editLink: {
    fontSize: 13,
    color: '#888888',
    textDecorationLine: 'underline',
    marginLeft: 'auto',
  },

  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },

  itemCategory: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 12,
  },

  itemDesc: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 24,
  },

  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C8B5A',
    textAlign: 'right',
  },

  bottomBar: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  chatButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});