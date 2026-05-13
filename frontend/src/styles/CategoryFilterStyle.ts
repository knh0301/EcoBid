import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const categoryFilterStyles = StyleSheet.create({
  categoryArea: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderColor: colors.borderLight,
    backgroundColor: colors.chipBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
  },

  categoryText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },

  categoryTextActive: {
    color: colors.textLight,
  },
});