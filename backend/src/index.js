const express = require('express');
const { startCollector } = require('./services/collector');
const app = express();

app.use(express.json());

app.use('/api/vms', require('./routes/vms'));
app.use('/api/metrics', require('./routes/metrics'));
app.use('/api/alerts', require('./routes/alerts'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  startCollector();
});
