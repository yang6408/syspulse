const { Pool } = require('pg');

// 환경변수만 사용 (하드코딩 제거)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS vm_targets (
    id SERIAL PRIMARY KEY,
    alias VARCHAR(64),
    local_ip VARCHAR(32),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS alert_rules (
    id SERIAL PRIMARY KEY,
    vm_id INTEGER REFERENCES vm_targets(id),
    metric VARCHAR(64),
    condition VARCHAR(8),
    threshold NUMERIC,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS alert_history (
    id SERIAL PRIMARY KEY,
    rule_id INTEGER REFERENCES alert_rules(id),
    vm_id INTEGER REFERENCES vm_targets(id),
    metric VARCHAR(64),
    value NUMERIC,
    triggered_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
  );
  CREATE TABLE IF NOT EXISTS metric_history (
    id SERIAL PRIMARY KEY,
    vm_id INTEGER REFERENCES vm_targets(id),
    cpu NUMERIC,
    memory NUMERIC,
    disk NUMERIC,
    network NUMERIC,
    collected_at TIMESTAMPTZ DEFAULT now()
  );
`).then(() => console.log('DB tables ready'))
  .catch(err => console.error('DB init error:', err));

module.exports = pool;
