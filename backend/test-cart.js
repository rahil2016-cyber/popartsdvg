
const http = require('http');

const testSessionId = '154e7c6b-c263-4338-9363-246cf73b2085';
console.log('Testing cart API with session ID:', testSessionId);

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: `/api/cart?sessionId=${testSessionId}`,
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', error => console.error('Error:', error));
req.end();
