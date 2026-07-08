require('dotenv').config();
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@erp.com',
      password: 'admin123'
    });
    console.log('Login SUCCESS!');
    console.log('Token:', response.data.token.substring(0, 50) + '...');
    console.log('User:', JSON.stringify(response.data.user, null, 2));
    
    // Test profile endpoint
    console.log('\nTesting profile API...');
    const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${response.data.token}` }
    });
    console.log('Profile SUCCESS!');
    console.log('Profile:', JSON.stringify(profileResponse.data, null, 2));
    
  } catch (err) {
    console.log('Login FAILED!');
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Error:', err.message);
    }
  }
}

testLogin();