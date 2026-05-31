import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { getLocalizedValue } from '../../utils/localization';
import EventFormModal from '../../components/admin/EventFormModal';
import useConfirm from '../../hooks/useConfirm';
import { useEvents } from '../../hooks/useEvents';

const EventManagementPage = () => {
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const {
    events,
    loading,
    error,
    refresh,
    createEvent,
    updateEvent,
    deleteEvent: apiDeleteEvent,
    uploadImage,
  } = useEvents();

  const handleAddNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, payload);
    } else {
      await createEvent(payload);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
    refresh();
  };

  const handleDelete = async (event) => {
    const name = getLocalizedValue(event.title, i18n.language, `#${event.id}`);
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      t('admin.events.confirmDelete', { name })
    );
    if (confirmed) {
      await apiDeleteEvent(event.id);
      refresh();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  if (loading) return <div>{t('common.loading', 'Loading...')}</div>;
  if (error) return <div>{t('admin.events.errorLoading', 'Error loading events.')}</div>;

  return (
    <div className="admin-page">
      <div className="admin-control-bar">
        <h3>{t('admin.events.title', 'Event Management')}</h3>
        <Button onClick={handleAddNew}>
          {t('admin.events.addNew', 'New Event')}
        </Button>
      </div>

      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.events.titleField', 'Title')}</th>
              <th>{t('admin.events.date', 'Date')}</th>
              <th>{t('admin.events.isFestival', 'Is Festival')}</th>
              <th>{t('common.category', 'Category')}</th>
              <th>{t('common.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-results">
                  {t('admin.events.noEvents', 'No events found.')}
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td>{getLocalizedValue(event.title, i18n.language)}</td>
                  <td>
                    {formatDate(event.startsAt)}
                    {event.endsAt && ` - ${formatDate(event.endsAt)}`}
                  </td>
                  <td>{event.isFestival ? t('common.yes', 'Yes') : t('common.no', 'No')}</td>
                  <td>{getLocalizedValue(event.category?.name, i18n.language)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Button variant="secondary" onClick={() => handleEdit(event)}>
                        {t('common.edit', 'Edit')}
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(event)}>
                        {t('common.delete', 'Delete')}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onUploadImage={uploadImage}
        />
      )}
    </div>
  );
};

export default EventManagementPage;
