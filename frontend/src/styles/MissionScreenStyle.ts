import {StyleSheet} from 'react-native';

export const missionStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  headerLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },

  pageSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 32,
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
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
    color: '#111827',
    flex: 1,
  },

  cardCredit: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5C8B5A',
  },

  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },

  button: {
    backgroundColor: '#86B27A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonCompleted: {
    backgroundColor: '#E5E7EB',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonTextCompleted: {
    color: '#9CA3AF',
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#111827',
  },

  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C8B5A',
  },

  progressBarTrack: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#5C8B5A',
  },
});