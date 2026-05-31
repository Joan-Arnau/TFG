import { useTranslation } from 'react-i18next';
import { useAdminBranding } from '../../hooks/admin/useAdminBranding';
import { SUPPORTED_LANGUAGES } from '../../constants';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MapPicker from '../../components/ui/MapPicker';
import ImageUpload from '../../components/forms/ImageUpload';

const AdminBrandingPage = () => {
  const { t } = useTranslation();
  const {
    config,
    loading,
    saving,
    error,
    saveSuccess,
    updateConfigField,
    updateBrandingField,
    handleLogoUpload,
    saveConfig,
  } = useAdminBranding();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save configuration
    const success = await saveConfig();
    if (success) {
      // Instantly apply branding colors to the page for a premium visual feedback loop
      document.documentElement.style.setProperty('--brand-primary', config.branding.primaryColor);
      document.documentElement.style.setProperty('--brand-secondary', config.branding.secondaryColor);
      
      // Update app document title
      document.title = `PromoRural BackOffice - ${config.municipalityName}`;
      
      // Flash reload to ensure i18n & global context hooks are updated properly
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>{t('common.loading', 'Carregant...')}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-control-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            {t('admin.branding.title', 'Configuració de Marca Blanca')}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>
            {t('admin.branding.subtitle', 'Identitat, geografia i idiomes del municipi')}
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? t('common.saving', 'Desant...') : t('common.save', 'Desar')}
        </Button>
      </div>

      {saveSuccess && (
        <div className="alert alert-success success mb-4" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #bbf7d0', background: '#dcfce7', color: '#15803d', marginBottom: '24px' }}>
          {t('admin.branding.saveSuccess', 'Configuració desada correctament. S\'estan aplicant els canvis...')}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mb-4" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fee2e2', color: '#b91c1c', marginBottom: '24px' }}>
          {t('admin.branding.saveError', 'Error al desar la configuració.')}: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-edit-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: General Identity and Languages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Visual Identity Card */}
            <Card style={{ padding: '24px' }}>
              <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                {t('admin.branding.sectionIdentity', 'Identitat Visual')}
              </h4>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {t('admin.branding.municipalityName', 'Nom del municipi')}
                </label>
                <input
                  type="text"
                  value={config.municipalityName}
                  onChange={(e) => updateConfigField('municipalityName', e.target.value)}
                  required
                  style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {t('admin.branding.logo', 'Logotip')}
                </label>
                <ImageUpload
                  currentImageUrl={config.branding.logoUrl}
                  onFileSelect={handleLogoUpload}
                />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                    {t('admin.branding.primaryColor', 'Color primari')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={config.branding.primaryColor}
                      onChange={(e) => updateBrandingField('primaryColor', e.target.value)}
                      style={{ width: '42px', height: '38px', padding: '0', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={config.branding.primaryColor}
                      onChange={(e) => updateBrandingField('primaryColor', e.target.value)}
                      placeholder="#0f172a"
                      pattern="^#([A-Fa-f0-9]{6})$"
                      style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.95rem', flex: 1, outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                    {t('admin.branding.secondaryColor', 'Color secundari')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="color"
                      value={config.branding.secondaryColor}
                      onChange={(e) => updateBrandingField('secondaryColor', e.target.value)}
                      style={{ width: '42px', height: '38px', padding: '0', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={config.branding.secondaryColor}
                      onChange={(e) => updateBrandingField('secondaryColor', e.target.value)}
                      placeholder="#2563eb"
                      pattern="^#([A-Fa-f0-9]{6})$"
                      style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.95rem', flex: 1, outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Language Management Card */}
            <Card style={{ padding: '24px' }}>
              <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                {t('admin.branding.sectionLanguages', "Gestió d'Idiomes")}
              </h4>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {t('admin.branding.defaultLanguage', 'Idioma per defecte')}
                </label>
                <select
                  value={config.defaultLanguage}
                  onChange={(e) => {
                    const lang = e.target.value;
                    updateConfigField('defaultLanguage', lang);
                    // Force the default language to be supported
                    if (!config.supportedLanguages.includes(lang)) {
                      updateConfigField('supportedLanguages', [...config.supportedLanguages, lang]);
                    }
                  }}
                  style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.95rem', width: '100%', outline: 'none', background: '#fff' }}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {t(`language.${lang}`, lang.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {t('admin.branding.supportedLanguages', 'Idiomes suportats')}
                </label>
                <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isDefault = config.defaultLanguage === lang;
                    const isChecked = config.supportedLanguages.includes(lang);
                    return (
                      <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isDefault ? 'not-allowed' : 'pointer', fontSize: '0.95rem', color: '#334155' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isDefault}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateConfigField('supportedLanguages', [...config.supportedLanguages, lang]);
                            } else {
                              updateConfigField('supportedLanguages', config.supportedLanguages.filter((l) => l !== lang));
                            }
                          }}
                        />
                        {t(`language.${lang}`, lang.toUpperCase())}
                        {isDefault && <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '4px' }}>({t('common.default', 'defecte')})</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Geographic Location */}
          <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
              {t('admin.branding.sectionGeography', 'Localització Geogràfica')}
            </h4>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {t('admin.branding.latitude', 'Latitud')}
                </label>
                <input
                  type="number"
                  step="any"
                  value={config.latitude}
                  onChange={(e) => updateConfigField('latitude', parseFloat(e.target.value) || 0)}
                  required
                  style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.875rem', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {t('admin.branding.longitude', 'Longitud')}
                </label>
                <input
                  type="number"
                  step="any"
                  value={config.longitude}
                  onChange={(e) => updateConfigField('longitude', parseFloat(e.target.value) || 0)}
                  required
                  style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label className="form-label" style={{ fontWeight: 550, fontSize: '0.875rem', color: '#64748b', marginBottom: '10px', display: 'block' }}>
                {t('admin.branding.mapHint', 'Fes clic al mapa per marcar el punt central del municipi')}
              </label>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', height: '240px', position: 'relative' }}>
                <MapPicker
                  lat={config.latitude}
                  lng={config.longitude}
                  onLocationSelect={(ll) => {
                    updateConfigField('latitude', ll.lat);
                    updateConfigField('longitude', ll.lng);
                  }}
                />
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="submit" disabled={saving} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600 }}>
            {saving ? t('common.saving', 'Desant...') : t('common.save', 'Desar els canvis')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBrandingPage;
