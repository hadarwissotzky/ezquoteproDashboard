const API_BASE_URL = 'https://app.ezquotepro.com/api:SIH9tnJ3';

class AuthAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async login(email, password) {
    try {
      // Xano expects "pass" not "password"
      const loginData = {
        email: email,
        pass: password  // Changed from "password" to "pass"
      };
      
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      
      // The response is wrapped in a 'result' object
      const result = data.result || data;
      
      // Check for token - Xano returns it with escaped quotes as "\"authToken\""
      let token = null;
      
      // First check for the weird escaped field name that Xano returns
      if (result['"authToken"']) {
        token = result['"authToken"'];
      } else if (result['\"authToken\"']) {
        token = result['\"authToken\"'];
      } else {
        // Fallback to check normal field names
        const possibleTokenFields = [
          'authToken', 'auth_token', 'token', 'Token', 
          'access_token', 'accessToken', 'jwt', 'JWT'
        ];
        
        for (const field of possibleTokenFields) {
          if (result[field]) {
            token = result[field];
            break;
          }
        }
      }
      
      // Also get user data from the result
      const userData = result['"user"'] || result['\"user\"'] || result.user || {};
      
      const authData = {
        email,
        authToken: token,
        user_id: userData.id || userData.user_id || result.id,
        first_name: userData.first_name || userData.firstName || '',
        last_name: userData.last_name || userData.lastName || ''
      };
      
      if (!authData.authToken) {
        throw new Error('Authentication failed - no token received');
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('ezquote_auth', JSON.stringify(authData));
      
      // Also store just the token for easy access
      localStorage.setItem('ezquote_token', authData.authToken || '');
      
      return authData;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('ezquote_auth');
    localStorage.removeItem('ezquote_token');
  }

  getToken() {
    return localStorage.getItem('ezquote_token');
  }

  getAuthData() {
    const auth = localStorage.getItem('ezquote_auth');
    if (auth) {
      try {
        return JSON.parse(auth);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthAPI();