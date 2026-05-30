import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminDashboardHeader from '../../components/admin/AdminDashboardHeader';
import AdminStats from '../../components/admin/AdminStats';
import PendingShopList from '../../components/admin/PendingShopList';
import AdminActiveShopTable from '../../components/admin/AdminActiveShopTable';
import AdminCategoryTable from '../../components/admin/AdminCategoryTable';
import AdminCategoryFormModal from '../../components/admin/AdminCategoryFormModal';
import ContactManagementPage from './ContactManagementPage';
import TourismManagementPage from './TourismManagementPage';
import { usePendingShops } from '../../hooks/usePendingShops';
import { useCategories } from '../../hooks/useCategories';
import useConfirm from '../../hooks/useConfirm';
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
      t('admin.shops.confirmApprove', { name }),
      `Are you sure you want to approve "${name}"?`
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
      t('admin.shops.confirmSuspend', { name }),
      `Are you sure you want to suspend "${name}"? This will return it to pending status.`
    );
    if (confirmed) {
      await suspendShop(shop.id);
    }
  };

  const handleDelete = async (shop) => {
    const name = getShopName(shop);
    const confirmed = await confirm(
      t('admin.shops.confirmDelete', { name }),
      `Are you sure you want to delete "${name}"? This action cannot be undone.`
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
      t('admin.categories.confirmDelete', { name }),
      `Are you sure you want to delete the category "${name}"?`
    );
    if (confirmed) {
      try {
        await apiDeleteCategory(category.id);
      } catch (err) {
        const backendMessage = err.response?.data?.message || err.message;
        alert(backendMessage || t('admin.categories.deleteError', 'Could not delete category.'));
      }
    }
  };

  return (
    <main className="dashboard">
      <AdminDashboardHeader onRefresh={handleRefresh} loading={loading} />
      <AdminStats pendingShops={pendingShops} />

      {/* Tabs Menu */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          {t('admin.tabs.pending', 'Pending Requests')} ({pendingShops.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('admin.tabs.active', 'All Shops')} ({allShops.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          {t('admin.tabs.categories', 'Categories')} ({categories.length})
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          {t('admin.tabs.contacts', 'Contacts')}
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'tourism' ? 'active' : ''}`}
          onClick={() => setActiveTab('tourism')}
        >
          {t('admin.tabs.tourism', 'Tourism')}
        </button>
      </div>

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
