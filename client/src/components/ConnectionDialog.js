import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button
} from '@mui/material';

/**
 * Bağlantı ekleme/düzenleme dialog bileşeni
 */
const ConnectionDialog = ({
  open,
  onClose,
  connection,
  onChange,
  onSave,
  isLoading,
  editMode
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editMode ? 'Bağlantıyı Düzenle' : 'Yeni Bağlantı Ekle'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Bağlantı Adı"
          type="text"
          fullWidth
          variant="outlined"
          value={connection.name}
          onChange={onChange}
        />
        <TextField
          select
          margin="dense"
          name="type"
          label="Veritabanı Türü"
          fullWidth
          variant="outlined"
          value={connection.type}
          onChange={onChange}
        >
          <MenuItem value="mysql">MySQL</MenuItem>
          <MenuItem value="postgres">PostgreSQL</MenuItem>
          <MenuItem value="mssql">MS SQL Server</MenuItem>
          <MenuItem value="sqlite">SQLite</MenuItem>
          <MenuItem value="oracle">Oracle</MenuItem>
          <MenuItem value="mongodb">MongoDB</MenuItem>
        </TextField>
        <TextField
          margin="dense"
          name="host"
          label="Sunucu"
          type="text"
          fullWidth
          variant="outlined"
          value={connection.host}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          name="port"
          label="Port"
          type="text"
          fullWidth
          variant="outlined"
          value={connection.port}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          name="username"
          label="Kullanıcı Adı"
          type="text"
          fullWidth
          variant="outlined"
          value={connection.username}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          name="password"
          label="Şifre"
          type="password"
          fullWidth
          variant="outlined"
          value={connection.password}
          onChange={onChange}
        />
        <TextField
          margin="dense"
          name="database"
          label="Veritabanı Adı"
          type="text"
          fullWidth
          variant="outlined"
          value={connection.database}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          İptal
        </Button>
        <Button
          onClick={onSave}
          color="primary"
          disabled={isLoading}
        >
          {isLoading
            ? (editMode ? 'Güncelleniyor...' : 'Kaydediliyor...')
            : (editMode ? 'Güncelle' : 'Kaydet')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionDialog;
