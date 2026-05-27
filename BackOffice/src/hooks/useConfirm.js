import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useConfirm() {
  const { t } = useTranslation();
  return useCallback((keyOrMessage, defaultMessage = 'Are you sure?') => {
    const msg = typeof keyOrMessage === 'string' ? t(keyOrMessage, defaultMessage) : defaultMessage;
    return Promise.resolve(window.confirm(msg));
  }, [t]);
}

export default useConfirm;
