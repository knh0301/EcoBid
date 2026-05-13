import {StyleSheet} from 'react-native';

export const sharedItemsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
  },

  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
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

  categoryScroll: {
    maxHeight: 52,
  },

  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },

  categoryChipSelected: {
    backgroundColor: '#5C8B5A',
    borderColor: '#5C8B5A',
  },

  categoryChipText: {
    fontSize: 13,
    color: '#1A1A1A',
  },

  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  grid: {
    padding: 16,
    paddingBottom: 80,
  },

  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  productCard: {
    width: '47%',
  },

  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#EAF2E9',
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImageText: {
    color: '#5C8B5A',
    fontWeight: 'bold',
  },

  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1A1A1A',
    marginRight: 6,
  },

  heartIcon: {
    fontSize: 18,
    color: '#888888',
  },

  heartIconActive: {
    color: '#5C8B5A',
  },

  productPrice: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },

  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: 'red',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888888',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5C8B5A',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
  },

  loadingIndicator: {
    marginTop: 40,
  },
});