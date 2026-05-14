import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const HomeScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <LanguageSwitcher />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.primaryColor }]}>
          {t('app.title')}
        </Text>
        <Text style={styles.subtitle}>
          {t('app.welcome')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
