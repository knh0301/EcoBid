import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const itemCardStyles = StyleSheet.create({
  itemCard: {
    width: '48.5%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 0,

    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  itemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemIcon: {
    fontSize: 46,
  },

  itemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemTextBox: {
    flex: 1,
    marginRight: 4,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  itemPrice: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  heartButton: {
    padding: 1,
  },
});