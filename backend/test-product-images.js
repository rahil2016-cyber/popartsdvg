
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/products',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Products:', json.products?.length, 'products');
      json.products?.forEach(p => {
        console.log('Product:', p.name, 'Primary Image:', p.primary_image, 'Images:', p.images?.length);
        if (p.primary_image) {
          console.log('Image URL:', 'http://127.0.0.1:5000' + p.primary_image);
        }
      });
    } catch (e) {
      console.error('Parse error:', e);
      console.log('Raw data:', data);
    }
  });
});

req.on('error', error => console.error('Error:', error));
req.end();
