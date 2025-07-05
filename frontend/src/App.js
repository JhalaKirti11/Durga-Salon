import React, { useState, useEffect } from 'react';
import AuthContainer from './components/Auth/AuthContainer';
import Dashboard from './components/Dashboard';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ProfilePage from './components/Profile/ProfilePage';
import AuthService from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    setSidebarOpen(false);
    setProfileOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openProfile = () => {
    setProfileOpen(true);
    setSidebarOpen(false); // Close sidebar when opening profile
  };

  const closeProfile = () => {
    setProfileOpen(false);
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
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar}
        user={user}
        onOpenProfile={openProfile}
      />

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        user={user}
        onOpenProfile={openProfile}
      />

      {/* Profile Page */}
      <ProfilePage
        user={user}
        isOpen={profileOpen}
        onClose={closeProfile}
      />

      {/* Main Content */}
      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
