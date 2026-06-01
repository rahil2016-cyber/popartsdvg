
const http = require('http');
const querystring = require('querystring');

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

async function testAddProduct() {
  try {
    console.log('Step 1: Logging in as admin...');
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
    if (loginRes.status !== 200) {
      throw new Error('Login failed');
    }
    const token = loginRes.data.token;
    console.log('✅ Login successful');

    console.log('Step 2: Getting categories...');
    const categoriesRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/categories',
      method: 'GET'
    });
    console.log('Categories:', categoriesRes.data);

    console.log('Step 3: Creating product...');
    const productData = JSON.stringify({
      name: 'Test Product',
      slug: 'test-product-1',
      description: 'Test description',
      price: '99.99',
      stock: '10',
      featured: true,
      category_id: categoriesRes.data[0]?.id || 1
    });

    const createRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/admin/products',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(productData)
      }
    }, productData);

    console.log('Create product response:', createRes);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAddProduct();
