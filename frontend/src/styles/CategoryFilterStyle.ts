import {StyleSheet} from 'react-native';

const LIGHT_GREEN = '#79AD6F';

export const categoryFilterStyles = StyleSheet.create({
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
    height: 36,
    paddingHorizontal: 22,
    borderRadius: 18,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#222222',
  },

  categoryTextActive: {
    color: '#FFFFFF',
  },
});