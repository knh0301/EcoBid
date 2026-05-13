import {StyleSheet} from 'react-native';

export const chatListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  headerLogo: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },

  titleHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },

  scrollContent: {
    flexGrow: 1,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },

  lastMessage: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },
});