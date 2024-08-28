import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user } = useAuth();

  // Function to get the user's initials
  const getUserInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
        >
          Task Manager
        </Typography>
        {user ? (
          <>
            <Avatar 
              style={{ marginLeft: 'auto', marginRight: '10px' }}
            >
              {getUserInitials(user.name)}
            </Avatar>
            <Button 
              component={Link} 
              to="/logout" 
              color="inherit" 
              style={{ marginLeft: '10px' }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              component={Link} 
              to="/login" 
              color="inherit" 
              style={{ marginLeft: 'auto' }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/register" 
              color="inherit" 
              style={{ marginLeft: '10px' }}
            >
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
