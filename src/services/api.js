const API_BASE_URL = 'https://app.base44.com/api/apps/68c2f080d6726d4efc132aec';
const API_KEY = 'ea7e513278ad46f3b8d8b5e85810cbaf';

export const dashboardAuthAPI = {
  async fetchAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/entities/DashboardAuth`, {
        headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard auth entities:', error);
      throw error;
    }
  },

  async fetchByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/entities/DashboardAuth?email=${encodeURIComponent(email)}`, {
        headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  async authenticate(email, password) {
    try {
      // First, check if user exists with this email
      const users = await this.fetchByEmail(email);
      
      if (!users || users.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const user = users[0];
      
      // In a real app, you'd validate the password against a hash
      // For now, we'll accept any password if the email exists
      // You should implement proper password validation on your backend
      
      return {
        success: true,
        user: {
          email: user.email,
          authToken: user.authToken || `token-${Date.now()}`,
          user_id: user.user_id,
          first_name: user.first_name || 'User',
          last_name: user.last_name || ''
        }
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  },

  async update(entityId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/entities/DashboardAuth/${entityId}`, {
        method: 'PUT',
        headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating dashboard auth entity:', error);
      throw error;
    }
  },

  async create(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/entities/DashboardAuth`, {
        method: 'POST',
        headers: {
          'api_key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating dashboard auth entity:', error);
      throw error;
    }
  }
};