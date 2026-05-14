import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const productDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    backgroundColor: colors.white,
  },

  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginHorizontal: 10,
    textAlign: 'center',
  },

  creditBadge: {
    backgroundColor: colors.lightGreenBackground,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },

  creditBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },

  imageBox: {
    width: 250,
    height: 250,
    backgroundColor: colors.grayBackground,
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
    backgroundColor: colors.lightGreenBackground,
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
    color: colors.textPrimary,
  },

  editButton: {
    marginLeft: 'auto',
  },

  editLink: {
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: 'underline',
    marginLeft: 'auto',
  },

  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },

  itemCategory: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
  },

  itemDesc: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 24,
  },

  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
  },

  bottomBar: {
    padding: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },

  chatButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },

  chatButtonText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
});