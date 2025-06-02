const express = require('express');
const router = express.Router();
const connectionService = require('../services/connectionService');

// ÖNEMLİ: Test route'u, ID parametre alan route'lardan ÖNCE tanımlanmalı
// Bağlantı testi
router.post('/test', async (req, res) => {
  try {
    // console.log("Test bağlantı verileri:", req.body);
    const result = await connectionService.testConnection(req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Bağlantı testi hatası:', error);
    res.status(500).json({ success: false, message: `Test hatası: ${error.message}` });
  }
});

// Tüm bağlantıları getir
router.get('/', async (req, res) => {
  try {
    const connections = await connectionService.getAllConnections();
    res.json(connections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Yeni bağlantı ekle
router.post('/', async (req, res) => {
  try {
    const newConnection = await connectionService.createConnection(req.body);
    res.status(201).json(newConnection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Bağlantı detayını şifre dahil getir
router.get('/:id/full', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectionService.getConnectionWithPasswordById(id);
    res.json(connection);
  } catch (error) {
    console.error(error);
    if (error.message === 'Bağlantı bulunamadı') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Bağlantı detayını getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectionService.getConnectionById(id);
    res.json(connection);
  } catch (error) {
    console.error(error);
    if (error.message === 'Bağlantı bulunamadı') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Bağlantıyı güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConnection = await connectionService.updateConnection(id, req.body);
    res.json(updatedConnection);
  } catch (error) {
    console.error(error);
    if (error.message === 'Bağlantı bulunamadı') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Bağlantıyı sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await connectionService.deleteConnection(id);
    res.json({ message: 'Bağlantı başarıyla silindi', id: result.id });
  } catch (error) {
    console.error(error);
    if (error.message === 'Bağlantı bulunamadı') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
