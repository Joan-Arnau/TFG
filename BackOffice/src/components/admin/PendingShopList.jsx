import { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import LocationSelector from '../../pages/merchant/components/LocationSelector';
import { getLocalizedValue } from '../../utils/localization';
import { resolveBackendStaticUrl } from '../../utils/backendUrls';
import { MERCHANT_LANGUAGES } from '../../pages/merchant/constants';

const PendingShopList = ({ shops, loading, error, onApprove, onReject, t, i18n }) => {
  const [selectedShop, setSelectedShop] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);

  const getShopName = (shop) => {
    return getLocalizedValue(shop.name, i18n.language, `#${shop.id}`);
  };

  const getCategoryName = (shop) => {
    if (!shop.category) return '';
    return getLocalizedValue(shop.category.name, i18n.language, '');
  };

  const handleOpenReview = (shop) => {
    setSelectedShop(shop);
    setRejectionReason('');
    setShowRejectForm(false);
  };

  const handleCloseReview = () => {
    if (!submittingAction) {
      setSelectedShop(null);
      setRejectionReason('');
      setShowRejectForm(false);
    }
  };

  const handleApprove = async () => {
    setSubmittingAction(true);
    try {
      await onApprove(selectedShop);
      handleCloseReview();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setSubmittingAction(true);
    try {
      await onReject(selectedShop, rejectionReason.trim());
      handleCloseReview();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  if (loading) {
    return (
      <section className="panel loading-container">
        <h3>{t('admin.shops.pendingTitle')}</h3>
        <p>{t('admin.shops.loading')}</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel error-container">
        <h3>{t('admin.shops.pendingTitle')}</h3>
        <p className="error">{t('admin.shops.error')}</p>
      </section>
    );
  }

  return (
    <section className="pending-shop-section">
      <h3 className="section-title">{t('admin.shops.pendingTitle')}</h3>
      {shops.length === 0 ? (
        <Card className="empty-pending-card">
          <p>{t('admin.shops.noPendingShops')}</p>
        </Card>
      ) : (
        <div className="pending-shop-grid">
          {shops.map((shop) => (
            <Card key={shop.id} className="pending-shop-card">
              <div className="pending-shop-card-content">
                <div className="pending-shop-card-main">
                  <strong>{getShopName(shop)}</strong>
                  <span className={`status-badge status-badge--${(shop.status || 'PENDING').toLowerCase()}`}>
                    {t(`admin.status.${(shop.status || 'PENDING').toLowerCase()}`, shop.status)}
                  </span>
                  {getCategoryName(shop) && (
                    <span className="badge-category">{getCategoryName(shop)}</span>
                  )}
                  {shop.address && <span className="pending-shop-address">{shop.address}</span>}
                </div>
                <div className="pending-shop-card-meta">
                  <span>{shop.ownerEmail}</span>
                </div>
              </div>
              <div className="pending-shop-card-actions">
                <Button onClick={() => handleOpenReview(shop)}>
                  {t('admin.shops.review', 'Review')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedShop && (
        <Modal onClose={handleCloseReview}>
          <div className="shop-review-modal">
            <header className="shop-review-header">
              <h3>{getShopName(selectedShop)}</h3>
              <span className={`status-badge status-badge--${(selectedShop.status || 'PENDING').toLowerCase()}`}>
                {t(`admin.status.${(selectedShop.status || 'PENDING').toLowerCase()}`, selectedShop.status)}
              </span>
              {getCategoryName(selectedShop) && (
                <span className="badge-category">{getCategoryName(selectedShop)}</span>
              )}
            </header>

            <div className="shop-review-body">
              {/* Banner Image */}
              {selectedShop.headerImageUrl ? (
                <div className="shop-review-banner">
                  <img
                    src={resolveBackendStaticUrl(selectedShop.headerImageUrl)}
                    alt={getShopName(selectedShop)}
                  />
                </div>
              ) : (
                <div className="shop-review-banner-placeholder">
                  <span>{t('admin.shops.noImage', 'No Header Image')}</span>
                </div>
              )}

              {/* Multilingual Name & Description */}
              <div className="review-section">
                <h4>{t('admin.shops.nameLabel', 'Name')}</h4>
                {MERCHANT_LANGUAGES.map(lang => (
                  <p key={lang} className="review-text">
                    <strong>{t(`language.${lang}`, lang.toUpperCase())}:</strong> {selectedShop.name?.[lang] || '-'}
                  </p>
                ))}
              </div>

              <div className="review-section">
                <h4>{t('admin.shops.descriptionTitle', 'Description')}</h4>
                {MERCHANT_LANGUAGES.map(lang => (
                  <p key={lang} className="review-description">
                    <strong>{t(`language.${lang}`, lang.toUpperCase())}:</strong> {selectedShop.description?.[lang] || '-'}
                  </p>
                ))}
              </div>

              {/* Info Details */}
              <div className="review-details-grid">
                <div className="review-detail-item">
                  <strong>{t('admin.shops.owner', 'Owner Email')}</strong>
                  <span>{selectedShop.ownerEmail || '-'}</span>
                </div>
                <div className="review-detail-item">
                  <strong>{t('admin.shops.phone', 'Phone')}</strong>
                  <span>{selectedShop.phoneNumber || '-'}</span>
                </div>
                <div className="review-detail-item">
                  <strong>{t('admin.shops.address', 'Address')}</strong>
                  <span>{selectedShop.address || '-'}</span>
                </div>
              </div>

              {/* Map */}
              <div className="review-section">
                <h4>{t('admin.shops.coordinates', 'Coordinates')}</h4>
                <LocationSelector
                  latitude={selectedShop.latitude}
                  longitude={selectedShop.longitude}
                  onLocationSelect={() => {}}
                  isEditing={false}
                />
              </div>

              {/* Reject Form */}
              {showRejectForm && (
                <form onSubmit={handleRejectSubmit} className="reject-form-area">
                  <div className="form-group">
                    <label htmlFor="rejectionReason">
                      {t('admin.shops.rejectionReasonLabel', 'Reason for Rejection')}
                    </label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={t('admin.shops.rejectionReasonPlaceholder', 'Enter reason to email the merchant...')}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="reject-form-actions">
                    <Button variant="secondary" onClick={() => setShowRejectForm(false)} disabled={submittingAction}>
                      {t('admin.shops.cancel', 'Cancel')}
                    </Button>
                    <Button type="submit" variant="danger" disabled={submittingAction}>
                      {submittingAction ? t('admin.shops.submitting', 'Sending...') : t('admin.shops.confirmRejectAction', 'Confirm Rejection')}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {!showRejectForm && (
              <footer className="shop-review-footer">
                <Button variant="secondary" onClick={handleCloseReview} disabled={submittingAction}>
                  {t('admin.shops.close', 'Close')}
                </Button>
                <div className="moderation-action-buttons">
                  {selectedShop.status !== 'SUSPENDED' && (
                    <Button variant="danger" onClick={() => setShowRejectForm(true)} disabled={submittingAction}>
                      {t('admin.shops.reject', 'Reject')}
                    </Button>
                  )}
                  <Button variant="success" onClick={handleApprove} disabled={submittingAction}>
                    {submittingAction ? t('admin.shops.submitting', 'Approving...') : t('admin.shops.approve', 'Approve')}
                  </Button>
                </div>
              </footer>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
};

export default PendingShopList;
