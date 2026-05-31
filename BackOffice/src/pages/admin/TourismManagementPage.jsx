import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePOIs } from '../../hooks/usePOIs';
import { useCategories } from '../../hooks/useCategories';
import { getLocalizedValue } from '../../utils/localization';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import useConfirm from '../../hooks/useConfirm';
import POIFormModal from '../../components/admin/POIFormModal';

const TourismManagementPage = () => {
  const { t, i18n } = useTranslation();
  const { pois, loading, error, refresh, create, update, delete: deletePOI, uploadImage } = usePOIs();
  const { categories } = useCategories();
  const confirm = useConfirm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPOI, setEditingPOI] = useState(null);

  const handleAdd = () => {
    setEditingPOI(null);
    setIsModalOpen(true);
  };

  const handleEdit = (poi) => {
    setEditingPOI(poi);
    setIsModalOpen(true);
  };

  const handleSave = async (payload) => {
    let savedPoi;
    if (editingPOI) {
      savedPoi = await update(editingPOI.id, payload);
    } else {
      savedPoi = await create(payload);
    }
    refresh();
    return savedPoi;
  };

  const handleDelete = async (poi) => {
    const name = getLocalizedValue(poi.name, i18n.language, `#${poi.id}`);
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      t('admin.tourism.confirmDelete', { name })
    );
    if (confirmed) {
      await deletePOI(poi.id);
      refresh();
    }
  };

  if (loading) return <div>{t('common.loading', 'Loading...')}</div>;
  if (error) return <div>{t('admin.tourism.error', 'Error loading POIs.')}</div>;

  return (
    <div className="admin-page">
      <div className="admin-control-bar">
        <h3>{t('admin.tourism.title', 'Tourism Management (POIs)')}</h3>
        <Button onClick={handleAdd}>
          {t('admin.tourism.addNew', 'New POI')}
        </Button>
      </div>
      <Card className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('common.image', 'Imatge')}</th>
              <th>{t('admin.contacts.name', 'Nom')}</th>
              <th>{t('admin.contacts.category', 'Categoria')}</th>
              <th>{t('admin.contacts.actions', 'Accions')}</th>
            </tr>
          </thead>
          <tbody>
            {pois.map((poi) => (
              <tr key={poi.id}>
                <td>{poi.id}</td>
                <td>
                  <img src={poi.imageUrl || '/default-poi.png'} alt={getLocalizedValue(poi.name, i18n.language)} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td>{getLocalizedValue(poi.name, i18n.language)}</td>
                <td>{getLocalizedValue(poi.category?.name, i18n.language)}</td>
                <td>
                  <div className="admin-table-actions">
                    <Button variant="secondary" onClick={() => handleEdit(poi)}>
                      {t('common.edit', 'Editar')}
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(poi)}>
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
        <POIFormModal
          poi={editingPOI}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          categories={categories.filter(c => c.type === 'POI')}
          onUploadImage={uploadImage}
          t={t}
        />
      )}
    </div>
  );
};

export default TourismManagementPage;

