const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios');

const PROMETHEUS = process.env.PROMETHEUS_URL || 'http://prometheus:9090';

// VM 온라인 상태 확인 함수
async function checkVmStatus(ip) {
  try {
    const response = await axios.get(`${PROMETHEUS}/api/v1/query`, {
      params: { query: `up{instance="${ip}:9100"}` }
    });
    const result = response.data.data.result;
    if (result.length === 0) return false;
    return result[0].value[1] === '1';
  } catch {
    return false;
  }
}

// VM 목록 조회 (온라인 상태 포함)
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM vm_targets WHERE enabled = true');

    // 각 VM의 온라인 상태 확인
    const vmsWithStatus = await Promise.all(
      rows.map(async vm => ({
        ...vm,
        online: await checkVmStatus(vm.local_ip)
      }))
    );

    res.json(vmsWithStatus);
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

// VM 수정
router.put('/:id', async (req, res) => {
  try {
    const { alias, local_ip } = req.body;
    await db.query(
      'UPDATE vm_targets SET alias=$1, local_ip=$2 WHERE id=$3',
      [alias, local_ip, req.params.id]
    );
    res.json({ message: 'VM 수정 완료' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VM 삭제
router.delete('/:id', async (req, res) => {
  try {
    await db.query('UPDATE vm_targets SET enabled=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'VM 삭제 완료' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
