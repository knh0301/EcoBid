import {StyleSheet} from 'react-native';

const LIGHT_GREEN = '#79AD6F';
const PAGE_BG = '#F7F9F6';

export const likedItemsStyles = StyleSheet.create({
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

  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 40,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
});