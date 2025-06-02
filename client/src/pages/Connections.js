import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// Özel servis ve bileşenler
import { connectionService } from '../services/api';
import { useAlert } from '../hooks/useAlert';
import ConnectionCard from '../components/ConnectionCard';
import ConnectionDialog from '../components/ConnectionDialog';

const Connections = () => {
  // State tanımlamaları
  const [connections, setConnections] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentConnectionId, setCurrentConnectionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    type: 'mysql',
    host: '',
    port: '',
    username: '',
    password: '',
    database: ''
  });

  // Bildirim hook'u
  const { alert, showAlert, showSuccess, showError, closeAlert } = useAlert();

  // Bağlantıları API'den getir - useCallback ile optimize edildi
  const fetchConnections = useCallback(async () => {
    try {
      const data = await connectionService.getAllConnections();
      setConnections(data);
    } catch (error) {
      console.error('Bağlantılar yüklenirken hata oluştu:', error);
      showError('Bağlantılar yüklenirken hata oluştu');
    }
  }, [showError]); // showError da useAlert'ten geldiği için dependency olarak eklenir

  // Sayfa yüklendiğinde bağlantıları getir
  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]); // fetchConnections'ı dependency olarak ekliyoruz

  // Dialog açma işleyicisi
  const handleOpenDialog = (connection = null) => {
    if (connection) {
      // Düzenleme modu
      setEditMode(true);
      setCurrentConnectionId(connection.id);
      setNewConnection({
        name: connection.name,
        type: connection.type,
        host: connection.host,
        port: connection.port,
        username: connection.username,
        password: '', // Şifre gösterilmez
        database: connection.database
      });
    } else {
      // Yeni bağlantı modu
      setEditMode(false);
      setCurrentConnectionId(null);
      setNewConnection({
        name: '',
        type: 'mysql',
        host: '',
        port: '',
        username: '',
        password: '',
        database: ''
      });
    }
    setOpenDialog(true);
  };

  // Dialog kapatma işleyicisi
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Form giriş değişikliği işleyicisi
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConnection(prev => ({ ...prev, [name]: value }));
  };

  // Bağlantı kaydetme işleyicisi
  const handleSaveConnection = async () => {
    try {
      setIsLoading(true);

      if (editMode) {
        // Bağlantı güncelleme
        await connectionService.updateConnection(currentConnectionId, newConnection);
        showSuccess('Bağlantı başarıyla güncellendi');
      } else {
        // Yeni bağlantı ekleme
        await connectionService.createConnection(newConnection);
        showSuccess('Bağlantı başarıyla eklendi');
      }

      // Bağlantıları yeniden yükle
      await fetchConnections();

      // Formu sıfırla ve kapat
      setNewConnection({
        name: '',
        type: 'mysql',
        host: '',
        port: '',
        username: '',
        password: '',
        database: ''
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Bağlantı işlemi sırasında hata oluştu:', error);
      showError(`Bağlantı ${editMode ? 'güncellenirken' : 'eklenirken'} hata oluştu: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Bağlantıyı silme işleyicisi
  const handleDeleteConnection = async (id) => {
    try {
      await connectionService.deleteConnection(id);
      await fetchConnections();
      showSuccess('Bağlantı başarıyla silindi');
    } catch (error) {
      console.error('Bağlantı silinirken hata oluştu:', error);
      showError(`Bağlantı silinirken hata oluştu: ${error.response?.data?.error || error.message}`);
    }
  };

  // Bağlantıyı test etme işleyicisi
  const handleTestConnection = async (connection) => {
    try {
      // Şifre değerini içermeyen bağlantılar için, şifre değerini almamız gerekiyor
      let testConnection = { ...connection };

      // Eğer şifre yoksa tam bağlantı bilgilerini al
      if (!testConnection.password && testConnection.id) {
        try {
          testConnection = await connectionService.getConnectionWithPassword(testConnection.id);
        } catch (err) {
          console.error('Bağlantı bilgileri alınamadı:', err);
          showError('Bağlantı bilgileri alınamadığı için test yapılamadı');
          return;
        }
      }

      // Port değerini sayıya dönüştür
      if (testConnection.port) {
        testConnection.port = parseInt(testConnection.port, 10);
      }

      console.log('Test edilecek bağlantı:', { ...testConnection, password: '***' });

      // Test işlemini yap
      const result = await connectionService.testConnection(testConnection);
      showAlert(result.message, result.success ? 'success' : 'error');
    } catch (error) {
      console.error('Bağlantı test edilirken hata oluştu:', error);
      showError(`Bağlantı test edilirken hata oluştu: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Veritabanı Bağlantıları
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Bağlantı Ekle
        </Button>
      </Paper>

      <Grid container spacing={3}>
        {connections.map((connection) => (
          <Grid item xs={12} sm={6} md={4} key={connection.id}>
            <ConnectionCard
              connection={connection}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteConnection}
              onTest={handleTestConnection}
            />
          </Grid>
        ))}
      </Grid>

      <ConnectionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        connection={newConnection}
        onChange={handleInputChange}
        onSave={handleSaveConnection}
        isLoading={isLoading}
        editMode={editMode}
      />

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Connections;
