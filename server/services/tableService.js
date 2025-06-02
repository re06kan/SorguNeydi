const { pool } = require('../config/db');

// Tablo listesini getir
const getAllTables = async () => {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public'
    AND table_type='BASE TABLE'
  `);
  return result.rows;
};

// Tablo yapısını getir
const getTableStructure = async (tableName) => {
  const result = await pool.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = $1
  `, [tableName]);
  return result.rows;
};

module.exports = {
  getAllTables,
  getTableStructure
};
