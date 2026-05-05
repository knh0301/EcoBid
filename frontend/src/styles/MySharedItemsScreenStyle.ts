import {StyleSheet} from 'react-native';

const GREEN = '#2F6F3E';
const LIGHT_GREEN = '#79AD6F';
const PAGE_BG = '#F7F9F6';

export const mySharedItemsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },

  header: {
    height: 58,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    position: 'relative',
  },

  backButton: {
    zIndex: 2,
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: '#222222',
  },

  creditBadge: {
    minWidth: 92,
    height: 30,
    borderRadius: 15,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginLeft: 'auto',
    zIndex: 2,
  },

  creditBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  categoryArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  categoryScrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },

  categoryChip: {
    height: 34,
    paddingHorizontal: 20,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryChipActive: {
    backgroundColor: LIGHT_GREEN,
    borderColor: LIGHT_GREEN,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#222222',
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },

  itemCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
  },

  itemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  itemIcon: {
    fontSize: 64,
  },

  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  itemTextBox: {
    flex: 1,
    marginRight: 8,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 6,
  },

  itemPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
  },
});