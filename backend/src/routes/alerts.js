const express = require('express');
const router = express.Router();
const db = require('../db');

// 알림 이력 조회
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM alert_history ORDER BY triggered_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 알림 규칙 조회
router.get('/rules', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alert_rules WHERE enabled = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
