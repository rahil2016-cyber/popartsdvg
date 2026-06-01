
const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testAPIs() {
  try {
    // Test categories endpoint
    console.log('Testing categories endpoint...');
    const catRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/categories',
      method: 'GET'
    });
    console.log('Categories response:', catRes);

    // Test get admin token
    console.log('\nLogging in as admin...');
    const loginData = JSON.stringify({
      email: 'admin@popartsdvg.com',
      password: 'admin123'
    });
    const loginRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, loginData);
    console.log('Login response:', loginRes);

    if (loginRes.data.token) {
      const token = loginRes.data.token;
      // Test admin products endpoint
      console.log('\nTesting admin products endpoint...');
      const prodRes = await request({
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/admin/products',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Products response:', prodRes);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testAPIs();
