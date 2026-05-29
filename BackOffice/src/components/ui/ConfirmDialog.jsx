import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, t }) => {
  return (
    <Modal onClose={onCancel}>
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <Button variant="secondary" onClick={onCancel}>
            {t('merchant.cancel', 'Cancel')}
          </Button>
          <Button onClick={onConfirm}>
            {t('app.confirmAction', 'OK')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
