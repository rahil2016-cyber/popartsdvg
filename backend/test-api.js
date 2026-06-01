
const axios = require('axios');

async function testAdminLogin() {
  try {
    const url = 'http://localhost:5000/api/auth/admin/login';
    console.log('Calling:', url);
    
    const res = await axios.post(url, {
      email: 'admin@popartsdvg.com',
      password: 'admin123'
    });
    
    console.log('Login successful!', res.data);
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testAdminLogin();
