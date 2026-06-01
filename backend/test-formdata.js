
const FormData = require('form-data');
const fs = require('fs');
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
    if (data) {
      data.pipe(req);
    } else {
      req.end();
    }
  });
}

function requestSimple(options, data = null) {
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

async function testAddProductWithImage() {
  try {
    console.log('Step 1: Logging in as admin...');
    const loginData = JSON.stringify({
      email: 'admin@popartsdvg.com',
      password: 'admin123'
    });
    const loginRes = await requestSimple({
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
    const categoriesRes = await requestSimple({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/categories',
      method: 'GET'
    });
    console.log('Categories:', categoriesRes.data);

    console.log('Step 3: Creating product with image...');
    const form = new FormData();
    form.append('name', 'Test Product with Image');
    form.append('slug', 'test-product-with-image-' + Date.now());
    form.append('description', 'Test description');
    form.append('price', '199.99');
    form.append('stock', '5');
    form.append('featured', 'true');
    form.append('category_id', categoriesRes.data[0].id);

    // Use the existing image in public/uploads
    const imagePath = 'public/uploads/1780126221238-927013708.jpg';
    if (fs.existsSync(imagePath)) {
      form.append('image', fs.createReadStream(imagePath));
    }

    const formHeaders = form.getHeaders();
    const createRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/admin/products',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formHeaders
      }
    }, form);

    console.log('Create product response:', createRes);

  } catch (error) {
    console.error('❌ Error:', error);
    if (error.stack) console.error(error.stack);
  }
}

testAddProductWithImage();
