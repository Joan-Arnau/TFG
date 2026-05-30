import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContacts } from '../../hooks/useContacts';
import { useCategories } from '../../hooks/useCategories';
import { getLocalizedValue } from '../../utils/localization';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useConfirm from '../../hooks/useConfirm';
import ContactFormModal from '../../components/admin/ContactFormModal';

const ContactManagementPage = () => {
  const { t, i18n } = useTranslation();
  const { contacts, loading, error, refresh, create, update, delete: deleteContact } = useContacts();
  const { categories } = useCategories();
  const confirm = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const handleAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editingContact) {
      await update(editingContact.id, payload);
    } else {
      await create(payload);
    }
    refresh();
  };

  const handleDelete = async (contact) => {
    const name = getLocalizedValue(contact.serviceName, i18n.language, `#${contact.id}`);
    const confirmed = await confirm(
      t('admin.contacts.confirmDelete', { name }),
      `Are you sure you want to delete the contact "${name}"?`
    );
    if (confirmed) {
      await deleteContact(contact.id);
      refresh();
    }
  };

  if (loading) return <div>{t('common.loading', 'Loading...')}</div>;
  if (error) return <div>{t('admin.contacts.error', 'Error loading contacts.')}</div>;

  return (
    <div className="admin-page">
      <div className="admin-control-bar">
        <h3>{t('admin.contacts.title', 'Contact Management')}</h3>
        <Button onClick={handleAdd}>
          {t('admin.contacts.addNew', 'New Contact')}
        </Button>
      </div>
      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.contacts.name', 'Name')}</th>
              <th>{t('admin.contacts.phone', 'Phone')}</th>
              <th>{t('admin.contacts.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{getLocalizedValue(contact.serviceName, i18n.language)}</td>
                <td>{contact.phoneNumber}</td>
                <td>
                  <Button variant="secondary" onClick={() => handleEdit(contact)} className="mr-2" style={{marginRight: '8px'}}>
                    {t('common.edit', 'Editar')}
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(contact)}>
                    {t('common.delete', 'Esborrar')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <ContactFormModal
          contact={editingContact}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          categories={categories}
          t={t}
        />
      )}
    </div>
  );
};

export default ContactManagementPage;

