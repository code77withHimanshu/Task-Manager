import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page
  }, [logout, navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
}

export default Logout;
