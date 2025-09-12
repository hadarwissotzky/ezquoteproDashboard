// Test different data structures for Xano auth
const API_BASE_URL = 'https://app.ezquotepro.com/api:SIH9tnJ3';

async function testAuthFormats() {
  const email = 'hadar@streamlinesocial.com';
  const password = 'Blowtorch11';
  
  console.log('Testing different data structures for Xano auth...\n');
  
  const formats = [
    // Standard formats
    { email, password },
    { Email: email, Password: password },
    
    // Nested structures
    { user: { email, password } },
    { credentials: { email, password } },
    { auth: { email, password } },
    { data: { email, password } },
    
    // Array format
    { email: [email], password: [password] },
    
    // String format
    { email: String(email), password: String(password) },
    
    // With additional fields
    { email, password, grant_type: 'password' },
    { email, password, type: 'login' },
    
    // Different field names
    { username: email, password },
    { user_email: email, user_password: password },
    { login: email, pass: password },
    
    // Wrapped in various ways
    { params: { email, password } },
    { input: { email, password } },
    { request: { email, password } }
  ];
  
  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];
    console.log(`\nTest ${i + 1}: Testing structure:`, JSON.stringify(format, null, 2));
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(format),
      });
      
      console.log(`Status: ${response.status}`);
      
      const data = await response.json().catch(() => ({}));
      
      if (response.ok) {
        console.log('✅ SUCCESS! Response:', data);
        break;
      } else if (data.message && !data.message.includes('Missing param: password')) {
        console.log('⚠️  Different error:', data.message);
      } else {
        console.log('❌ Still missing password param');
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  }
}

testAuthFormats();