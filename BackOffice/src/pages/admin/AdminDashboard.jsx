import AdminDashboardHeader from '../../components/admin/AdminDashboardHeader';
import AdminStats from '../../components/admin/AdminStats';
import PendingShopList from '../../components/admin/PendingShopList';
import { usePendingShops } from '../../hooks/usePendingShops';

const AdminDashboard = () => {
  const { pendingShops, loading, error, refresh } = usePendingShops();

  return (
    <main className="dashboard">
      <AdminDashboardHeader onRefresh={refresh} loading={loading} />
      <AdminStats pendingShops={pendingShops} />
      <PendingShopList shops={pendingShops} loading={loading} error={error} />
    </main>
  );
};

export default AdminDashboard;
