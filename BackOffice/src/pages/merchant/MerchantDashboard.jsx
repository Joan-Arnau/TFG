import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import PromotionsListPage from './PromotionsListPage';
import PromotionFormPage from './PromotionFormPage';
import ImagesPage from './ImagesPage';
import useMerchantDashboard from './hooks/useMerchantDashboard';
import { MERCHANT_ROUTES } from './constants';

const MerchantDashboard = () => {
  const { hero, navItems, badge } = useMerchantDashboard();

  return (
    <div className="merchant-dashboard">
      <header className="merchant-hero panel">
        <div>
          <p className="merchant-eyebrow">{hero.eyebrow}</p>
          <h2>{hero.title}</h2>
          <p>{hero.description}</p>
        </div>
        <div className="merchant-hero-badge">{badge}</div>
      </header>

      <div className="merchant-shell">
        <aside className="merchant-nav panel">
          {navItems.map((item) => (
            <Link key={item.key} className="merchant-nav-link" to={item.to}>{item.label}</Link>
          ))}
        </aside>

        <main className="merchant-content panel">
          <Routes>
            <Route index element={<Navigate to={MERCHANT_ROUTES.PROFILE} replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="promotions" element={<PromotionsListPage />} />
            <Route path="promotions/new" element={<PromotionFormPage />} />
            <Route path="promotions/:id/edit" element={<PromotionFormPage />} />
            <Route path="images" element={<ImagesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;
