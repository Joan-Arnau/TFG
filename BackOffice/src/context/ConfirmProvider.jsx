import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmContext } from './ConfirmContext';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export const ConfirmProvider = ({ children }) => {
  const { t } = useTranslation();
  const [config, setConfig] = useState(null);

  const confirm = useCallback((keyOrMessage, defaultMessage = 'Are you sure?', customTitle = null) => {
    return new Promise((resolve) => {
      let message;
      if (typeof keyOrMessage === 'string' && keyOrMessage) {
        if (typeof defaultMessage === 'object' && defaultMessage !== null) {
          message = t(keyOrMessage, defaultMessage);
        } else {
          message = t(keyOrMessage, { defaultValue: defaultMessage });
        }
      } else {
        message = defaultMessage;
      }
      
      setConfig({
        title: customTitle || t('app.confirmTitle', 'Confirmation'),
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
