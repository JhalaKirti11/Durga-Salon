import React from 'react';

const Header = ({ onToggleSidebar, user, onOpenProfile }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="logo">
            <i className="fas fa-cut"></i>
            <span>Durga Salon</span>
          </div>
        </div>
        
        <div className="header-right">
          {user ? (
            <div className="user-menu">
              <div className="user-info" onClick={onOpenProfile}>
                <span className="user-name">{user.name}</span>
                <i className="fas fa-user-circle user-avatar"></i>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="btn-secondary">Sign In</button>
              <button className="btn-primary">Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 