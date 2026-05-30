import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getCommonStyles } from '../styles/commonStyles';
import { getSettingsStyles } from '../styles/Settings.styles';

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getSettingsStyles(theme);

  const supportedLanguageCodes = theme?.supportedLanguages || ['ca', 'es', 'en'];

  const allLanguages = [
    { code: 'ca', label: t('language.ca') },
    { code: 'es', label: t('language.es') },
    { code: 'en', label: t('language.en') },
  ];

  const languages = allLanguages.filter(lang => supportedLanguageCodes.includes(lang.code));

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
  };

  const showAbout = () => {
    Alert.alert(
      t('about.title'),
      `${t('about.platform')}\n\n${t('about.description')}\n\n${t('about.copyright')}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language.label')}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                i18n.language === lang.code && styles.languageItemActive
              ]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={[
                styles.languageLabel,
                i18n.language === lang.code && styles.languageLabelActive
              ]}>
                {lang.label}
              </Text>
              {i18n.language === lang.code && (
                <Ionicons name="checkmark-circle" size={24} color={theme.primaryColor} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          <TouchableOpacity 
            style={styles.languageItem}
            onPress={showAbout}
          >
            <Text style={styles.languageLabel}>{t('settings.about')}</Text>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoFooter}>
          <Text style={styles.versionText}>PromoRural v1.0.0</Text>
          <Text style={styles.versionText}>TFG - Universitat Rovira i Virgili</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
