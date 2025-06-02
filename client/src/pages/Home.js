import React from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        SorguNeydi'ye Hoş Geldiniz
      </Typography>
      <Typography variant="body1" paragraph>
        Bu uygulama, farklı veritabanlarında dinamik sorgular çalıştırmanıza olanak tanır.
        MySQL, PostgreSQL, SQLite, MongoDB, Oracle ve MSSQL gibi çeşitli veritabanlarıyla çalışabilirsiniz.
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/connections"
        >
          Bağlantıları Yönet
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={RouterLink}
          to="/query"
        >
          Sorgu Çalıştır
        </Button>
      </Box>
    </Paper>
  );
};

export default Home;
