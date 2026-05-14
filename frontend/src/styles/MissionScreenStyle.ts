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
    padding: 20,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.pageTitle,
    marginBottom: 8,
  },

  pageSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 32,
    marginBottom: 16,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cardTitle,
    flex: 1,
  },

  cardCredit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },

  cardDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },

  button: {
    backgroundColor: colors.chatGreen,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonCompleted: {
    backgroundColor: colors.borderSoft,
  },

  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonTextCompleted: {
    color: colors.textDisabled,
  },

  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cardTitle,
  },

  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },

  progressBarTrack: {
    height: 12,
    backgroundColor: colors.lightGrayBackground,
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});