// Simple test script to verify backend API is running
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('\n✅ Backend API is running successfully!');
    console.log('🌐 Frontend should be running at http://localhost:3000');
    console.log('🔗 API available at http://localhost:5000/api');
  });
});

req.on('error', (error) => {
  console.error('❌ Error connecting to backend:', error.message);
  console.log('\nPlease ensure the backend server is running:');
  console.log('  cd backend && npm run dev');
});

req.end();