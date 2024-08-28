import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "486880569229-te48aevb35vql663i8rn8dshhb5m9enn.apps.googleusercontent.com"; // Replace with your actual Google Client ID

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
