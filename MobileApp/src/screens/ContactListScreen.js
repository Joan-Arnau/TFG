import { View, Text, SectionList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useContacts } from '../hooks/useContacts';
import { getCommonStyles } from '../styles/commonStyles';
import { getContactStyles } from '../styles/Contact.styles';
import { Ionicons } from '@expo/vector-icons';

const ContactListScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const commonStyles = getCommonStyles(theme);
  const styles = getContactStyles(theme);
  
  const { contacts, loading, error, refetch } = useContacts();

  const handleCall = (number) => {
    if (number) {
      Linking.openURL(`tel:${number.replace(/\s+/g, '')}`);
    }
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleCall(item.phoneNumber)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={item.iconName} size={24} color={theme.primaryColor} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
      </View>
      <View style={styles.callButton}>
        <Ionicons name="call" size={20} color={theme.primaryColor} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#CCC" />
        <Text style={commonStyles.errorText}>{t('shop.error_loading')}</Text>
        <TouchableOpacity style={commonStyles.button} onPress={refetch}>
          <Text style={commonStyles.buttonText}>{t('contact.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        onRefresh={refetch}
        refreshing={loading}
        ListEmptyComponent={
          <View style={commonStyles.centered}>
            <Ionicons name="call-outline" size={48} color="#CCC" />
            <Text style={{ marginTop: 10, color: '#999' }}>{t('contact.no_contacts')}</Text>
          </View>
        }
      />
    </View>
  );
};

export default ContactListScreen;
