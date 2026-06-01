
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Starting test server...');

app.post('/api/auth/admin/login', (req, res) => {
  console.log('Got login request:', req.body);
  res.json({ _id: 1, name: 'Admin', email: 'admin@popartsdvg.com', token: 'test-token-123' });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Test server is up!' });
});

app.listen(5000, () => {
  console.log('Test server listening on 5000');
});
