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
