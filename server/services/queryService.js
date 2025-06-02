const { pool } = require('../config/db');

// Sorgu çalıştır
const executeQuery = async (query) => {
  const result = await pool.query(query);
  return {
    columns: result.fields.map(field => field.name),
    rows: result.rows
  };
};

module.exports = {
  executeQuery
};
