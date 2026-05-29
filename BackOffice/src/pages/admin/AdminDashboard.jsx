import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminDashboardHeader from '../../components/admin/AdminDashboardHeader';
import AdminStats from '../../components/admin/AdminStats';
import PendingShopList from '../../components/admin/PendingShopList';
import AdminActiveShopTable from '../../components/admin/AdminActiveShopTable';
import { usePendingShops } from '../../hooks/usePendingShops';
import { useConfirm } from '../../hooks/useConfirm';
import { getLocalizedValue } from '../../utils/localization';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState('pending');
const {
  pendingShops,
  allShops,
  loading,
  error,
  refresh,
  approveShop,
  rejectShop,
  deleteShop
} = usePendingShops();

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
      await rejectShop(shop.id, t('admin.shops.suspendedByAdmin', 'Suspended by administration.'));
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

  return (
    <main className="dashboard">
      <AdminDashboardHeader onRefresh={refresh} loading={loading} />
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
      </div>

      {/* Tab Contents */}
      <div className="admin-tab-content">
        {activeTab === 'pending' ? (
          <PendingShopList
            shops={pendingShops}
            loading={loading}
            error={error}
            onApprove={handleApprove}
            onReject={handleReject}
            t={t}
            i18n={i18n}
          />
        ) : (
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
      </div>
    </main>
  );
};

export default AdminDashboard;
