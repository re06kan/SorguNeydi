const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const sql = require('mssql');
const sqlite3 = require('sqlite3');
const { MongoClient } = require('mongodb');

class DbService {
  async testConnection(type, config) {
    switch (type) {
      case 'mysql':
        return this.testMySqlConnection(config);
      case 'postgres':
        return this.testPostgresConnection(config);
      case 'mssql':
        return this.testMsSqlConnection(config);
      case 'sqlite':
        return this.testSqliteConnection(config);
      case 'mongodb':
        return this.testMongoConnection(config);
      default:
        throw new Error('Desteklenmeyen veritabanı türü');
    }
  }

  async executeQuery(connectionId, query, params = []) {
    // Bağlantı bilgilerini getir
    const connection = await this.getConnectionById(connectionId);

    // Bağlantı türüne göre sorguyu çalıştır
    switch (connection.type) {
      case 'mysql':
        return this.executeMySqlQuery(connection.config, query, params);
      case 'postgres':
        return this.executePostgresQuery(connection.config, query, params);
      case 'mssql':
        return this.executeMsSqlQuery(connection.config, query, params);
      case 'sqlite':
        return this.executeSqliteQuery(connection.config, query, params);
      case 'mongodb':
        return this.executeMongoQuery(connection.config, query, params);
      default:
        throw new Error('Desteklenmeyen veritabanı türü');
    }
  }

  // MySQL bağlantı ve sorgu metodları
  async testMySqlConnection(config) {
    const connection = await mysql.createConnection(config);
    await connection.connect();
    const [result] = await connection.query('SELECT 1 as test');
    await connection.end();
    return result;
  }

  async executeMySqlQuery(config, query, params) {
    const connection = await mysql.createConnection(config);
    const [results] = await connection.execute(query, params);
    await connection.end();
    return results;
  }

  // PostgreSQL bağlantı ve sorgu metodları
  async testPostgresConnection(config) {
    const pool = new Pool(config);
    const result = await pool.query('SELECT 1 as test');
    await pool.end();
    return result.rows;
  }

  async executePostgresQuery(config, query, params) {
    const pool = new Pool(config);
    const result = await pool.query(query, params);
    await pool.end();
    return result.rows;
  }

  // Diğer veritabanları için benzer metodlar...

  // Bağlantı bilgilerini ID'ye göre getir (burada bir veritabanı kullanabilirsiniz)
  async getConnectionById(id) {
    // Örnek olarak burada hard-coded bir bağlantı döndürüyoruz
    // Gerçek uygulamada bu bilgileri bir veritabanından almalısınız
    return {
      id,
      type: 'mysql',
      config: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'test'
      }
    };
  }
}

module.exports = new DbService();
