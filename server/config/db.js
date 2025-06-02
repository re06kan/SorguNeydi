const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sorguneydi',
  // NOT: Gerçek uygulamada şifreler şifrelenmeli ve güvenli bir şekilde saklanmalıdır!
  password: 'admin123',
  port: 5432,
});

// Uygulama başlangıcında connections tablosunu oluştur
const initDatabase = async () => {
  try {
    // Connections tablosunu oluştur (eğer yoksa)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS connections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        host VARCHAR(255) NOT NULL,
        port INTEGER NOT NULL,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        database VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Veritabanı tabloları kontrol edildi');
  } catch (error) {
    console.error('Veritabanı başlatma hatası:', error);
  }
};

module.exports = {
  pool,
  initDatabase
};
