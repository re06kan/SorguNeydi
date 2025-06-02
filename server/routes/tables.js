const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const connectionService = require('../services/connectionService');

// Tablo listesini getir
router.get('/', async (req, res) => {
  try {
    const connectionId = req.headers['connection-id'];

    if (!connectionId) {
      return res.status(400).json({ error: 'Bağlantı ID belirtilmedi' });
    }

    console.log(`Tablolar istendi - Bağlantı ID: ${connectionId}`);

    try {
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
          connectionTimeoutMillis: 5000
        });

        try {
          const result = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema='public'
            AND table_type='BASE TABLE'
          `);

          await client.end();
          res.json(result.rows);
        } catch (dbError) {
          console.error('Veritabanı sorgu hatası:', dbError);
          await client.end().catch(() => {});
          throw new Error(`Tablolar alınırken hata: ${dbError.message}`);
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
          const [rows] = await conn.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = ?
          `, [connection.database]);

          await conn.end();

          // MySQL sonuçları PostgreSQL formatına dönüştür
          const formattedRows = rows.map(row => ({
            table_name: row.TABLE_NAME || row.table_name
          }));

          res.json(formattedRows);
        } catch (dbError) {
          console.error('MySQL sorgu hatası:', dbError);
          await conn.end().catch(() => {});
          throw new Error(`Tablolar alınırken hata: ${dbError.message}`);
        }
      }
      else {
        throw new Error(`${connection.type} veritabanı türü için tablo listesi desteği henüz eklenmedi`);
      }
    } catch (connError) {
      console.error('Bağlantı hatası:', connError);
      throw connError;
    }
  } catch (error) {
    console.error('Tablo listesi alınırken hata:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tablo yapısını getir
router.get('/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const connectionId = req.headers['connection-id'];

    if (!connectionId) {
      return res.status(400).json({ error: 'Bağlantı ID belirtilmedi' });
    }

    console.log(`Tablo yapısı istendi - Tablo: ${tableName}, Bağlantı ID: ${connectionId}`);

    // Bağlantı bilgilerini al
    const connection = await connectionService.getConnectionWithPasswordById(connectionId);

    // Veritabanı türüne göre işlem yap
    if (connection.type === 'postgres') {
      const client = new Pool({
        user: connection.username,
        host: connection.host,
        database: connection.database,
        password: connection.password,
        port: parseInt(connection.port, 10),
        connectionTimeoutMillis: 5000
      });

      try {
        const result = await client.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = $1
        `, [tableName]);

        await client.end();
        res.json(result.rows);
      } catch (dbError) {
        console.error('Veritabanı sorgu hatası:', dbError);
        await client.end().catch(() => {});
        throw new Error(`Tablo yapısı alınırken hata: ${dbError.message}`);
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
        const [rows] = await conn.query(`
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = ?
          AND table_schema = ?
        `, [tableName, connection.database]);

        await conn.end();

        // MySQL sonuçları PostgreSQL formatına dönüştür
        const formattedRows = rows.map(row => ({
          column_name: row.COLUMN_NAME || row.column_name,
          data_type: row.DATA_TYPE || row.data_type
        }));

        res.json(formattedRows);
      } catch (dbError) {
        console.error('MySQL sorgu hatası:', dbError);
        await conn.end().catch(() => {});
        throw new Error(`Tablo yapısı alınırken hata: ${dbError.message}`);
      }
    }
    else {
      throw new Error(`${connection.type} veritabanı türü için tablo yapısı desteği henüz eklenmedi`);
    }
  } catch (error) {
    console.error('Tablo yapısı alınırken hata:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
