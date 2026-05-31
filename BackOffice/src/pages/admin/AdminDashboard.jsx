import EventManagementPage from './EventManagementPage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminBrandingPage from './AdminBrandingPage';
import AdminDashboardHeader from '../../components/admin/AdminDashboardHeader';
import AdminStats from '../../components/admin/AdminStats';
import PendingShopList from '../../components/admin/PendingShopList';
import AdminActiveShopTable from '../../components/admin/AdminActiveShopTable';
import AdminCategoryTable from '../../components/admin/AdminCategoryTable';
import AdminCategoryFormModal from '../../components/admin/AdminCategoryFormModal';
import ContactManagementPage from './ContactManagementPage';
import TourismManagementPage from './TourismManagementPage';
import AnnouncementManagementPage from './AnnouncementManagementPage';
import { usePendingShops } from '../../hooks/admin/usePendingShops';
import { useCategories } from '../../hooks/common/useCategories';
import { useAnnouncements } from '../../hooks/admin/useAnnouncements';
import { useEvents } from '../../hooks/admin/useEvents';
import { usePOIs } from '../../hooks/admin/usePOIs';
import useConfirm from '../../hooks/common/useConfirm';
import { getLocalizedValue } from '../../utils/localization';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState('pending');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const {
    pendingShops,
    allShops,
    loading: shopsLoading,
    error: shopsError,
    refresh: refreshShops,
    approveShop,
    rejectShop,
    suspendShop,
    deleteShop
  } = usePendingShops();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    filterType,
    setFilterType,
    refresh: refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory: apiDeleteCategory
  } = useCategories();

  const { announcements } = useAnnouncements();
  const { events } = useEvents();
  const { pois } = usePOIs();

  const loading = activeTab === 'categories' ? categoriesLoading : shopsLoading;
  const error = activeTab === 'categories' ? categoriesError : shopsError;

  const handleRefresh = () => {
    if (activeTab === 'categories') {
      refreshCategories();
    } else {
      refreshShops();
    }
  };

  const getShopName = (shop) => {
    return getLocalizedValue(shop.name, i18n.language, `#${shop.id}`);
  };

  const handleApprove = async (shop) => {
    const name = getShopName(shop);
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      `${t('admin.shops.confirmApprove', { name })}\n\n${t('admin.shops.confirmApproveMessage', { name: name })}`
    );
    if (confirmed) {
      await approveShop(shop.id);
    }
  };

  const handleReject = async (shop, reason) => {
    await rejectShop(shop.id, reason);
  };

  const handleSuspend = async (shop) => {
    const name = getShopName(shop);
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      `${t('admin.shops.confirmSuspend', { name })}\n\n${t('admin.shops.confirmSuspendMessage', { name: name })}`
    );
    if (confirmed) {
      await suspendShop(shop.id);
    }
  };

  const handleDelete = async (shop) => {
    const name = getShopName(shop);
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      `${t('admin.shops.confirmDelete', { name })}\n\n${t('admin.shops.confirmDeleteMessage', { name: name })}`
    );
    if (confirmed) {
      await deleteShop(shop.id);
    }
  };

  // Category Actions
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (payload) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await createCategory(payload);
    }
  };

  const handleDeleteCategory = async (category) => {
    const name = getLocalizedValue(category.name, i18n.language, `#${category.id}`);
    const confirmed = await confirm(
      t('app.confirmTitle', 'Confirmació'),
      t('admin.categories.confirmDelete', { name })
    );
    if (confirmed) {
      try {
        await apiDeleteCategory(category.id);
        refreshCategories();
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message || err.message;
        
        let localizedError = t('admin.categories.deleteError', 'No s\'ha pogut esborrar la categoria.');
        
        if (status === 400 || status === 409 || (message && (message.includes('error.category.in_use') || message.includes('Cannot delete category because it is in use')))) {
          localizedError = t('admin.categories.errorInUse', 'Aquesta categoria està en ús i no es pot esborrar.');
          await confirm('', localizedError, t('app.errorTitle', 'Error'));
        } else {
          await confirm('', localizedError, t('app.errorTitle', 'Error'));
        }
      }
    }
  };

  return (
    <main className="dashboard">
      <AdminDashboardHeader onRefresh={handleRefresh} loading={loading} />
      <AdminStats 
        pendingShopsCount={pendingShops.length} 
        allShopsCount={allShops.filter(s => s.status === 'APPROVED').length} 
        categoriesCount={categories.length} 
        announcementsCount={announcements.length} 
        eventsCount={events.length} 
        poisCount={pois.length} 
      />

      <div className="admin-dashboard-layout">
        {/* Tabs Menu */}
        <aside className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <span>{t('admin.tabs.pending', 'Pending Requests')}</span>
            <span className="tab-badge">{pendingShops.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <span>{t('admin.tabs.active', 'All Shops')}</span>
            <span className="tab-badge">{allShops.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span>{t('admin.tabs.categories', 'Categories')}</span>
            <span className="tab-badge">{categories.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <span>{t('admin.tabs.contacts', 'Contacts')}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'tourism' ? 'active' : ''}`}
            onClick={() => setActiveTab('tourism')}
          >
            <span>{t('admin.tabs.tourism', 'Turisme')}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <span>{t('admin.tabs.announcements', 'Bandos')}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span>{t('admin.tabs.events', 'Events')}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            <span>{t('admin.tabs.branding', 'Marca Blanca')}</span>
          </button>
        </aside>

        {/* Tab Contents */}
        <div className="admin-tab-content">
          {activeTab === 'pending' && (
            <PendingShopList
              shops={pendingShops}
              loading={loading}
              error={error}
              onApprove={handleApprove}
              onReject={handleReject}
              t={t}
              i18n={i18n}
            />
          )}
          {activeTab === 'all' && (
            <AdminActiveShopTable
              shops={allShops}
              loading={loading}
              error={error}
              onSuspend={handleSuspend}
              onApprove={handleApprove}
              onDelete={handleDelete}
              t={t}
              i18n={i18n}
            />
          )}
          {activeTab === 'categories' && (
            <AdminCategoryTable
              categories={categories}
              loading={loading}
              error={error}
              filterType={filterType}
              onFilterChange={setFilterType}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onAddNew={handleAddNewCategory}
              t={t}
              i18n={i18n}
            />
          )}
          {activeTab === 'contacts' && (
            <ContactManagementPage />
          )}
          {activeTab === 'tourism' && (
            <TourismManagementPage />
          )}
          {activeTab === 'announcements' && (
            <AnnouncementManagementPage />
          )}
          {activeTab === 'events' && (
            <EventManagementPage />
          )}
          {activeTab === 'branding' && (
            <AdminBrandingPage />
          )}
        </div>
      </div>

      {isCategoryModalOpen && (
        <AdminCategoryFormModal
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleSaveCategory}
          t={t}
        />
      )}
    </main>
  );
};

export default AdminDashboard;
