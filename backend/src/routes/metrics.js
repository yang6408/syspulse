const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

const PROMETHEUS = process.env.PROMETHEUS_URL || 'http://prometheus:9090';

// 현재 메트릭 (실시간)
router.get('/current', async (req, res) => {
  try {
    const { vm } = req.query;
    const instance = `${vm}:9100`;

    const queries = {
      cpu: `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle",instance="${instance}"}[1m])) * 100)`,
      memory: `(1 - node_memory_MemAvailable_bytes{instance="${instance}"} / node_memory_MemTotal_bytes{instance="${instance}"}) * 100`,
      disk: `avg(1 - node_filesystem_avail_bytes{instance="${instance}",fstype!="tmpfs"} / node_filesystem_size_bytes{instance="${instance}",fstype!="tmpfs"}) * 100`,
      network: `sum(rate(node_network_receive_bytes_total{instance="${instance}"}[1m]))`,
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const response = await axios.get(`${PROMETHEUS}/api/v1/query`, {
        params: { query }
      });
      const value = response.data.data.result[0]?.value[1];
      results[key] = value ? parseFloat(value).toFixed(2) : 0;
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 이력 조회 (range 또는 시작/끝 시간)
router.get('/history', async (req, res) => {
  try {
    const { vm_id, range, start, end } = req.query;

    let whereClause = '';

    if (start && end) {
      // 직접 입력한 시작/끝 시간으로 조회
      whereClause = `AND collected_at >= '${start}'::timestamptz
                     AND collected_at <= '${end}'::timestamptz`;
    } else {
      // 버튼 범위로 조회
      const intervalMap = { '1h': '1 hour', '3h': '3 hours', '6h': '6 hours', '12h': '12 hours', '24h': '24 hours' };
      const interval = intervalMap[range] || '1 hour';
      whereClause = `AND collected_at > now() - interval '${interval}'`;
    }

    const result = await db.query(
      `SELECT cpu, memory, disk, network,
              to_char(collected_at AT TIME ZONE 'Asia/Seoul', 'HH24:MI:SS') as time
       FROM metric_history
       WHERE vm_id = $1
       ${whereClause}
       ORDER BY collected_at ASC`,
      [vm_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
