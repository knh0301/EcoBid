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
    height: 58,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    position: 'relative',
  },

  backButton: {
    zIndex: 2,
  },

  backArrow: {
    fontSize: 18,
    color: colors.textPrimary,
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: colors.textDark,
  },

  creditBadge: {
    minWidth: 92,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginLeft: 'auto',
    zIndex: 2,
  },

  creditBadgeText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '800',
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },

  avatarPhoto: {
    width: '100%',
    height: '100%',
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

  imageScrollContent: {
  paddingHorizontal: 16,
  paddingTop: 16,
  gap: 10,
},

productImage: {
  width: 250,
  height: 250,
  borderRadius: 12,
  backgroundColor: colors.grayBackground,
},

imageBox: {
  width: 250,
  height: 250,
  borderRadius: 12,
  backgroundColor: colors.grayBackground,
  justifyContent: 'center',
  alignItems: 'center',
},

imageText: {
  color: colors.textMuted,
  fontSize: 14,
  fontWeight: '700',
},
});
