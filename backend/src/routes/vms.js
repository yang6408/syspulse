const express = require('express');
const router = express.Router();
const db = require('../db');

// VM 목록 조회
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM vm_targets WHERE enabled = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VM 등록
router.post('/', async (req, res) => {
  try {
    const { alias, local_ip } = req.body;
    await db.query(
      'INSERT INTO vm_targets (alias, local_ip) VALUES ($1, $2)',
      [alias, local_ip]
    );
    res.json({ message: 'VM 등록 완료' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
