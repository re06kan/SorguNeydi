import axios from 'axios';

const API_URL = 'http://localhost:5001';

// Bağlantı servisi
export const connectionService = {
  // Tüm bağlantıları getir
  getAllConnections: async () => {
    const response = await axios.get(`${API_URL}/api/connections`);
    return response.data;
  },

  // Bağlantı detayını getir
  getConnectionById: async (id) => {
    const response = await axios.get(`${API_URL}/api/connections/${id}`);
    return response.data;
  },

  // Şifre dahil bağlantı detayını getir
  getConnectionWithPassword: async (id) => {
    const response = await axios.get(`${API_URL}/api/connections/${id}/full`);
    return response.data;
  },

  // Bağlantı oluştur
  createConnection: async (connectionData) => {
    const response = await axios.post(`${API_URL}/api/connections`, connectionData);
    return response.data;
  },

  // Bağlantı güncelle
  updateConnection: async (id, connectionData) => {
    const response = await axios.put(`${API_URL}/api/connections/${id}`, connectionData);
    return response.data;
  },

  // Bağlantı sil
  deleteConnection: async (id) => {
    const response = await axios.delete(`${API_URL}/api/connections/${id}`);
    return response.data;
  },

  // Bağlantı testi
  testConnection: async (connectionData) => {
    const response = await axios.post(`${API_URL}/api/connections/test`, connectionData);
    return response.data;
  }
};

// Veritabanı şema servisi
export const schemaService = {
  // Tablo listesini getir
  getTables: async (connectionId) => {
    const response = await axios.get(`${API_URL}/api/tables`, {
      headers: { 'Connection-Id': connectionId }
    });
    return response.data;
  },

  // Tablo yapısını getir
  getTableColumns: async (tableName, connectionId) => {
    const response = await axios.get(`${API_URL}/api/tables/${tableName}`, {
      headers: { 'Connection-Id': connectionId }
    });
    return response.data;
  }
};

// Sorgu servisi
export const queryService = {
  // Sorgu çalıştır
  executeQuery: async (query, connectionId) => {
    const response = await axios.post(`${API_URL}/api/query`, {
      query,
      connectionId
    });
    return response.data;
  }
};
