import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';

const supportedLanguages = [
  { code: 'ca', label: 'Català' },
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' }
];

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value) => {
    i18n.changeLanguage(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('language.label')}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={i18n.resolvedLanguage ?? 'ca'}
          onValueChange={handleLanguageChange}
          style={styles.picker}
        >
          {supportedLanguages.map((lang) => (
            <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default LanguageSwitcher;
