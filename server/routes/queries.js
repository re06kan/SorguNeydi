const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const connectionService = require('../services/connectionService');

// Sorgu çalıştır
router.post('/', async (req, res) => {
  try {
    const { query, connectionId } = req.body;

    if (!connectionId) {
      return res.status(400).json({ error: 'Bağlantı ID belirtilmedi' });
    }

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Geçerli bir sorgu belirtilmedi' });
    }

    console.log(`Sorgu istendi - Bağlantı ID: ${connectionId}`);
    console.log(`Sorgu: ${query}`);

    // Bağlantı bilgilerini al
    const connection = await connectionService.getConnectionWithPasswordById(connectionId);
    console.log(`Bağlantı bilgileri alındı - Tür: ${connection.type}, Veritabanı: ${connection.database}`);

    // Veritabanı türüne göre işlem yap
    if (connection.type === 'postgres') {
      const client = new Pool({
        user: connection.username,
        host: connection.host,
        database: connection.database,
        password: connection.password,
        port: parseInt(connection.port, 10),
        connectionTimeoutMillis: 30000 // Uzun sorgular için daha uzun timeout
      });

      try {
        const result = await client.query(query);
        await client.end();

        res.json({
          columns: result.fields.map(field => field.name),
          rows: result.rows
        });
      } catch (dbError) {
        console.error('PostgreSQL sorgu hatası:', dbError);
        await client.end().catch(() => {});
        throw new Error(`Sorgu çalıştırılırken hata: ${dbError.message}`);
      }
    }
    else if (connection.type === 'mysql') {
      const mysql = require('mysql2/promise');
      const conn = await mysql.createConnection({
        host: connection.host,
        port: parseInt(connection.port, 10),
        user: connection.username,
        password: connection.password,
        database: connection.database
      });

      try {
        const [rows, fields] = await conn.query(query);
        await conn.end();

        // Sonuçları standartlaştır
        const columns = fields ? fields.map(field => field.name) : [];

        res.json({
          columns: columns,
          rows: rows
        });
      } catch (dbError) {
        console.error('MySQL sorgu hatası:', dbError);
        await conn.end().catch(() => {});
        throw new Error(`Sorgu çalıştırılırken hata: ${dbError.message}`);
      }
    }
    else {
      throw new Error(`${connection.type} veritabanı türü için sorgu çalıştırma desteği henüz eklenmedi`);
    }
  } catch (error) {
    console.error('Sorgu çalıştırılırken hata:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
