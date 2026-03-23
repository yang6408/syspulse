const axios = require('axios');
const db = require('../db');

const PROMETHEUS = process.env.PROMETHEUS_URL || 'http://prometheus:9090';

async function queryPrometheus(query) {
  try {
    const response = await axios.get(`${PROMETHEUS}/api/v1/query`, {
      params: { query }
    });
    const value = response.data.data.result[0]?.value[1];
    return value ? parseFloat(parseFloat(value).toFixed(2)) : 0;
  } catch {
    return 0;
  }
}

async function collectMetrics() {
  try {
    // 등록된 VM 목록 조회
    const { rows: vms } = await db.query(
      'SELECT * FROM vm_targets WHERE enabled = true'
    );

    for (const vm of vms) {
      const instance = `${vm.local_ip}:9100`;

      const cpu = await queryPrometheus(
        `100 - (avg by(instance)(rate(node_cpu_seconds_total{mode="idle",instance="${instance}"}[1m])) * 100)`
      );
      const memory = await queryPrometheus(
        `(1 - node_memory_MemAvailable_bytes{instance="${instance}"} / node_memory_MemTotal_bytes{instance="${instance}"}) * 100`
      );
      const disk = await queryPrometheus(
        `avg(1 - node_filesystem_avail_bytes{instance="${instance}",fstype!="tmpfs"} / node_filesystem_size_bytes{instance="${instance}",fstype!="tmpfs"}) * 100`
      );
      const network = await queryPrometheus(
        `sum(rate(node_network_receive_bytes_total{instance="${instance}"}[1m]))`
      );

      await db.query(
        `INSERT INTO metric_history (vm_id, cpu, memory, disk, network)
         VALUES ($1, $2, $3, $4, $5)`,
        [vm.id, cpu, memory, disk, network]
      );

      console.log(`[collector] ${vm.alias} cpu=${cpu} mem=${memory} disk=${disk} net=${network}`);
    }
  } catch (err) {
    console.error('[collector] error:', err.message);
  }
}

// 15초마다 수집
function startCollector() {
  console.log('[collector] 시작 - 15초마다 메트릭 수집');
  collectMetrics();
  setInterval(collectMetrics, 15000);
}

module.exports = { startCollector };
