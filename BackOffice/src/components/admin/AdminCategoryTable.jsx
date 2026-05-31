import Button from '../ui/Button';
import Card from '../ui/Card';
import { getLocalizedValue } from '../../utils/localization';

const AdminCategoryTable = ({
  categories,
  loading,
  error,
  filterType,
  onFilterChange,
  onEdit,
  onDelete,
  onAddNew,
  t,
  i18n,
}) => {
  const getCategoryName = (category) => {
    return getLocalizedValue(category.name, i18n.language, `#${category.id}`);
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'SHOP':
        return t('admin.categoryTypes.shop', 'Comerç');
      case 'ANNOUNCEMENT':
        return t('admin.categoryTypes.announcement', 'Comunicat');
      case 'EVENT':
        return t('admin.categoryTypes.event', 'Esdeveniment');
      case 'POI':
        return t('admin.categoryTypes.poi', 'Punt d\'Interès');
      case 'CONTACT':
        return t('admin.categoryTypes.contact', 'Telèfon d\'Interès');
      default:
        return type;
    }
  };

  const filterOptions = [
    { value: '', label: t('admin.categories.filterAll', 'Tots els tipus') },
    { value: 'SHOP', label: t('admin.categoryTypes.shop', 'Comerç') },
    { value: 'ANNOUNCEMENT', label: t('admin.categoryTypes.announcement', 'Comunicat') },
    { value: 'EVENT', label: t('admin.categoryTypes.event', 'Esdeveniment') },
    { value: 'POI', label: t('admin.categoryTypes.poi', 'Punt d\'Interès') },
    { value: 'CONTACT', label: t('admin.categoryTypes.contact', 'Telèfon d\'Interès') },
  ];

  return (
    <div className="admin-categories-panel">
      {/* Category control bar */}
      <div className="admin-control-bar mb-4">
        <div className="admin-filter-group">
          <label htmlFor="category-type-filter" className="filter-label mr-2">
            {t('admin.categories.filterLabel', 'Filtrar per:')}
          </label>
          <select
            id="category-type-filter"
            className="form-input filter-select"
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="primary" onClick={onAddNew}>
          {t('admin.categories.addNew', 'Nova Categoria')}
        </Button>
      </div>

      {loading ? (
        <div className="panel loading-container">
          <p>{t('admin.categories.loading', 'Carregant categories...')}</p>
        </div>
      ) : error ? (
        <div className="panel error-container">
          <p className="error">{t('admin.categories.error', 'Error carregant categories.')}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="panel empty-container">
          <p>{t('admin.categories.noCategories', 'No s\'han trobat categories.')}</p>
        </div>
      ) : (
        <Card className="admin-table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>{t('admin.categories.tableName', 'Nom')}</th>
                  <th>{t('admin.categories.tableType', 'Tipus')}</th>
                  <th>{t('admin.categories.tableActions', 'Accions')}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                      <strong>{getCategoryName(category)}</strong>
                    </td>
                    <td>
                      <span className={`status-badge status-badge--type-${(category.type || 'SHOP').toLowerCase()}`}>
                        {getTypeName(category.type)}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Button variant="secondary" onClick={() => onEdit(category)}>
                          {t('common.edit', 'Editar')}
                        </Button>
                        <Button variant="danger" onClick={() => onDelete(category)}>
                          {t('common.delete', 'Esborrar')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminCategoryTable;
