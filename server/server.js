const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/db');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Veritabanını başlat
initDatabase();

// API rotaları
app.use('/api/connections', require('./routes/connections'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/query', require('./routes/queries'));

// Ana rota
app.get('/', (req, res) => {
  res.send('SorguNeydi API çalışıyor');
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
