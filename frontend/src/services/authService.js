const API_BASE_URL = 'http://localhost:5001/api';

class AuthService {
  // Sign up user
  static async signUp(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Sign in user
  static async signIn(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user data');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Store token in localStorage
  static setToken(token) {
    localStorage.setItem('token', token);
  }

  // Get token from localStorage
  static getToken() {
    return localStorage.getItem('token');
  }

  // Store user data in localStorage
  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user data from localStorage
  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Remove token and user data (logout)
  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.getToken();
  }

  // Get auth headers for API calls
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
}

export default AuthService; 