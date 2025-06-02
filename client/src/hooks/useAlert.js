import { useState } from 'react';

/**
 * Bildirim state'ini ve işleyicilerini yöneten özel hook
 */
export const useAlert = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  });

  // Bildirimi kapat
  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  // Bildirim göster
  const showAlert = (message, severity = 'info') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  // Başarı bildirimi
  const showSuccess = (message) => {
    showAlert(message, 'success');
  };

  // Hata bildirimi
  const showError = (message) => {
    showAlert(message, 'error');
  };

  return {
    alert,
    showAlert, // Bu satırı ekliyoruz
    showSuccess,
    showError,
    closeAlert
  };
};
