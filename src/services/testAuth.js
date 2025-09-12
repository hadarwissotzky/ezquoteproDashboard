// Test script to determine correct Xano auth format
const API_BASE_URL = 'https://app.ezquotepro.com/api:SIH9tnJ3';

async function testAuthEndpoint() {
  const email = 'hadar@streamlinesocial.com';
  const password = 'Blowtorch11';
  
  console.log('Testing Xano authentication endpoint...\n');
  
  // Test 1: Check if endpoint exists with GET
  console.log('Test 1: Checking if /auth/login exists with GET...');
  try {
    const getResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'GET',
    });
    console.log('GET /auth/login status:', getResponse.status);
  } catch (error) {
    console.log('GET /auth/login error:', error.message);
  }
  
  // Test 2: Try different endpoint paths
  const endpoints = [
    '/auth/login',
    '/login',
    '/auth',
    '/user/login',
    '/users/login',
    '/authenticate'
  ];
  
  console.log('\nTest 2: Trying different endpoint paths...');
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(`POST ${endpoint} - Status: ${response.status}`);
      
      if (response.status !== 404) {
        const data = await response.json().catch(() => ({}));
        console.log(`Response from ${endpoint}:`, data);
      }
    } catch (error) {
      console.log(`POST ${endpoint} - Error:`, error.message);
    }
  }
  
  // Test 3: Try sending as query parameters (some APIs do this)
  console.log('\nTest 3: Trying as query parameters...');
  try {
    const params = new URLSearchParams({ email, password });
    const response = await fetch(`${API_BASE_URL}/auth/login?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    console.log('Query params status:', response.status);
    const data = await response.json().catch(() => ({}));
    console.log('Query params response:', data);
  } catch (error) {
    console.log('Query params error:', error.message);
  }
  
  // Test 4: Try multipart form data
  console.log('\nTest 4: Trying multipart form data...');
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData,
    });
    console.log('Multipart status:', response.status);
    const data = await response.json().catch(() => ({}));
    console.log('Multipart response:', data);
  } catch (error) {
    console.log('Multipart error:', error.message);
  }
}

// Run the test
testAuthEndpoint();