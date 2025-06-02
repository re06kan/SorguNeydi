const { pool } = require('../config/db');
const { Pool } = require('pg');

// Tüm bağlantıları getir
const getAllConnections = async () => {
  const result = await pool.query('SELECT id, name, type, host, port, username, database, created_at FROM connections ORDER BY name');
  return result.rows;
};

// Bağlantı detayını getir
const getConnectionById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, type, host, port, username, database, created_at FROM connections WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Bağlantı bulunamadı');
  }

  return result.rows[0];
};

// Bağlantı detayını şifre dahil getir
const getConnectionWithPasswordById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, type, host, port, username, password, database, created_at FROM connections WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Bağlantı bulunamadı');
  }

  return result.rows[0];
};

// Yeni bağlantı ekle
const createConnection = async (connectionData) => {
  const { name, type, host, port, username, password, database } = connectionData;

  const result = await pool.query(
    'INSERT INTO connections (name, type, host, port, username, password, database) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, type, host, port, username, database, created_at',
    [name, type, host, port, username, password, database]
  );

  return result.rows[0];
};

// Bağlantıyı güncelle
const updateConnection = async (id, connectionData) => {
  const { name, type, host, port, username, password, database } = connectionData;

  // Şifre değiştirilmek isteniyorsa güncelle, değilse eski şifreyi koru
  let query, params;

  if (password) {
    query = `
      UPDATE connections
      SET name = $1, type = $2, host = $3, port = $4,
          username = $5, password = $6, database = $7
      WHERE id = $8
      RETURNING id, name, type, host, port, username, database, created_at
    `;
    params = [name, type, host, port, username, password, database, id];
  } else {
    query = `
      UPDATE connections
      SET name = $1, type = $2, host = $3, port = $4,
          username = $5, database = $6
      WHERE id = $7
      RETURNING id, name, type, host, port, username, database, created_at
    `;
    params = [name, type, host, port, username, database, id];
  }

  const result = await pool.query(query, params);

  if (result.rows.length === 0) {
    throw new Error('Bağlantı bulunamadı');
  }

  return result.rows[0];
};

// Bağlantıyı sil
const deleteConnection = async (id) => {
  const result = await pool.query('DELETE FROM connections WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    throw new Error('Bağlantı bulunamadı');
  }

  return result.rows[0];
};

// Bağlantı testi
const testConnection = async (connectionData) => {
  const { type, host, port, username, password, database } = connectionData;

  // Bağlantı tipine göre farklı işlem yap
  if (type === 'mysql') {
    const mysql = require('mysql2/promise');

    try {
      const connection = await mysql.createConnection({
        host: host,
        port: port,
        user: username,
        password: password,
        database: database
      });

      await connection.ping();
      await connection.end();
      return { success: true, message: 'MySQL bağlantısı başarılı' };
    } catch (error) {
      console.error('MySQL bağlantı hatası:', error);
      return { success: false, message: `MySQL bağlantı hatası: ${error.message}` };
    }
  }
  else if (type === 'postgres') {
    const { Pool } = require('pg');

    let client = null;
    try {
      client = new Pool({
        user: username,
        host: host,
        database: database,
        password: password,
        port: port,
        // Hızlı bağlantı testi için kısa timeout
        connectionTimeoutMillis: 5000
      });

      // Basit bir sorgu çalıştır
      await client.query('SELECT 1');
      await client.end();
      return { success: true, message: 'PostgreSQL bağlantısı başarılı' };
    } catch (error) {
      console.error('PostgreSQL bağlantı hatası:', error);
      if (client) await client.end().catch(() => {});
      return { success: false, message: `PostgreSQL bağlantı hatası: ${error.message}` };
    }
  }
  else {
    return { success: false, message: `${type} veritabanı türü henüz desteklenmiyor` };
  }
};

module.exports = {
  getAllConnections,
  getConnectionById,
  getConnectionWithPasswordById, // Yeni fonksiyonu ekleyin
  createConnection,
  updateConnection,
  deleteConnection,
  testConnection
};
