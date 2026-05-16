import { StyleSheet } from 'react-native';

export const getSettingsStyles = (theme) => StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C757D',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 5,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  languageItemActive: {
    borderWidth: 1,
    borderColor: theme.primaryColor,
  },
  languageLabel: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  languageLabelActive: {
    color: theme.primaryColor,
    fontWeight: 'bold',
  },
  infoFooter: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#ADB5BD',
  }
});
