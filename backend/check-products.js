
const http = require('http');

async function fetchProducts() {
  try {
    const options = {
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/products',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const result = JSON.parse(data);
        console.log('✅ Products:', JSON.stringify(result, null, 2));
        if (result.products) {
          result.products.forEach(product => {
            console.log(`\n📦 Product: ${product.name}`);
            console.log(`   Primary Image:`, product.primary_image);
            console.log(`   All Images:`, product.images);
          });
        }
      });
    });

    req.on('error', (error) => console.error('❌ Error fetching products:', error));
    req.end();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Give server a second to start
setTimeout(fetchProducts, 2000);
