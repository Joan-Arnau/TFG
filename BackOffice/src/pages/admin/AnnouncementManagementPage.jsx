import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '../../hooks/admin/useAnnouncements';
import { useCategories } from '../../hooks/common/useCategories';
import { getLocalizedValue } from '../../utils/localization';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useConfirm from '../../hooks/common/useConfirm';
import AnnouncementFormModal from '../../components/admin/AnnouncementFormModal';

const AnnouncementManagementPage = () => {
  const { t, i18n } = useTranslation();
  const { announcements, loading, error, refresh, create, update, delete: deleteAnnouncement, updateStatus } = useAnnouncements();
  const { categories } = useCategories();
  const confirm = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editingAnnouncement) {
      await update(editingAnnouncement.id, payload);
    } else {
      await create(payload);
    }
    refresh();
  };

  const handleDelete = async (announcement) => {
    const title = getLocalizedValue(announcement.title, i18n.language, `#${announcement.id}`);
    const confirmed = await confirm(
      t('admin.announcements.confirmDelete', { title }),
      `Are you sure you want to delete the announcement "${title}"?`
    );
    if (confirmed) {
      await deleteAnnouncement(announcement.id);
      refresh();
    }
  };

  const handleStatusToggle = async (announcement) => {
    const isPublishing = announcement.status !== 'PUBLISHED';
    const title = getLocalizedValue(announcement.title, i18n.language, `#${announcement.id}`);
    
    const confirmKey = isPublishing ? 'admin.announcements.confirmPublish' : 'admin.announcements.confirmArchive';
    const messageKey = isPublishing ? 'admin.announcements.confirmPublishMessage' : 'admin.announcements.confirmArchiveMessage';
    
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      `${t(confirmKey, { title })}\n\n${t(messageKey, { title: title })}`
    );

    if (confirmed) {
      const newStatus = isPublishing ? 'PUBLISHED' : 'ARCHIVED';
      await updateStatus(announcement.id, newStatus);
      refresh();
    }
  };

  if (loading) return <div>{t('common.loading', 'Carregant...')}</div>;
  if (error) return <div>{t('admin.announcements.error', 'Error carregant bandos.')}</div>;

  return (
    <div className="admin-page">
      <div className="admin-control-bar">
        <h3>{t('admin.announcements.title', 'Gestió de Bandos')}</h3>
        <Button onClick={handleAdd}>
          {t('admin.announcements.addNew', 'Nou Bando')}
        </Button>
      </div>
      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.announcements.date', 'Data')}</th>
              <th>{t('admin.announcements.titleField', 'Títol')}</th>
              <th>{t('admin.announcements.status', 'Estat')}</th>
              <th>{t('admin.announcements.actions', 'Accions')}</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{new Date(announcement.publishedAt).toLocaleDateString()}</td>
                <td>
                  {getLocalizedValue(announcement.title, i18n.language)}
                  {(announcement.urgent || announcement.isUrgent) && <span className="badge badge-danger ml-2">Urgent</span>}
                </td>
                <td>{t(`admin.status.${announcement.status.toLowerCase()}`, announcement.status)}</td>
                <td>
                  <div className="admin-table-actions">
                    <Button variant="secondary" onClick={() => handleStatusToggle(announcement)}>
                      {announcement.status === 'PUBLISHED' ? 'Arxivar' : 'Publicar'}
                    </Button>
                    <Button variant="primary" onClick={() => handleEdit(announcement)}>
                      {t('common.edit', 'Editar')}
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(announcement)}>
                      {t('common.delete', 'Esborrar')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      
      {isModalOpen && (
        <AnnouncementFormModal
          announcement={editingAnnouncement}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          categories={categories.filter(c => c.type === 'ANNOUNCEMENT')}
          t={t}
        />
      )}
    </div>
  );
};

export default AnnouncementManagementPage;
