import React, { useState, useEffect } from 'react';
import AuthContainer from './components/Auth/AuthContainer';
import AuthService from './services/authService';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = () => {
      const token = AuthService.getToken();
      const userData = AuthService.getUser();
      
      if (token && userData) {
        setUser(userData);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthContainer onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Durga Salon</h1>
        <div className="user-info">
          <p>Hello, {user.name}!</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      <main className="App-main">
        <h2>Dashboard</h2>
        <p>You are successfully logged in. This is your salon dashboard area.</p>
        {/* Add your salon content here */}
      </main>
    </div>
  );
}

export default App;
