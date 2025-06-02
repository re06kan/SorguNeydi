import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Sayfalar
import Connections from './pages/Connections';
import QueryPage from './pages/QueryPage';
import Layout from './components/Layout';

// Ana navigasyon yapısı - BrowserRouter'ı kaldırdık
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/connections" replace />} />
        <Route path="connections" element={<Connections />} />
        <Route path="query" element={<QueryPage />} />
        <Route path="*" element={
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <h2>Sayfa bulunamadı!</h2>
            <p>Aradığınız sayfa mevcut değil.</p>
          </Box>
        } />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
