import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './Auth.css';

const AuthContainer = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSwitchToSignUp = () => {
    setIsSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignUp(false);
  };

  const handleAuthSuccess = (userData) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  return (
    <div className="auth-wrapper">
      {isSignUp ? (
        <SignUp 
          onSwitchToSignIn={handleSwitchToSignIn}
          onSignUpSuccess={handleAuthSuccess}
        />
      ) : (
        <SignIn 
          onSwitchToSignUp={handleSwitchToSignUp}
          onSignInSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default AuthContainer; 