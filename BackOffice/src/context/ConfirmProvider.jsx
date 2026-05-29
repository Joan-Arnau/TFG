import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmContext } from './ConfirmContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export const ConfirmProvider = ({ children }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(null);

  const confirm = useCallback((keyOrMessage, defaultMessage = 'Are you sure?') => {
    return new Promise((resolve) => {
      const message = typeof keyOrMessage === 'string' ? t(keyOrMessage, defaultMessage) : defaultMessage;
      
      setConfig({
        title: t('app.confirmTitle', 'Confirmation'),
        message,
        onConfirm: () => {
          setConfig(null);
          resolve(true);
        },
        onCancel: () => {
          setConfig(null);
          resolve(false);
        }
      });
    });
  }, [t]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {config && (
        <ConfirmDialog
          title={config.title}
          message={config.message}
          onConfirm={config.onConfirm}
          onCancel={config.onCancel}
          t={t}
        />
      )}
    </ConfirmContext.Provider>
  );
};
