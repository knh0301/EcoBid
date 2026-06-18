import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const missionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrayBackground,
  },

  headerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.pageTitle,
    marginBottom: 6,
  },

  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 24,
    marginBottom: 12,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.cardTitle,
    flex: 1,
  },

  cardCredit: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
  },

  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },

  button: {
    backgroundColor: colors.chatGreen,
    borderRadius: 10,
    minHeight: 42,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonCompleted: {
    backgroundColor: colors.borderSoft,
  },

  buttonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },

  buttonTextCompleted: {
    color: colors.textDisabled,
  },

  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.cardTitle,
  },

  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },

  progressBarTrack: {
    height: 10,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
