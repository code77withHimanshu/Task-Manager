import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user } = useAuth();

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
          <Button 
            component={Link} 
            to="/logout" 
            color="inherit" 
            style={{ marginLeft: 'auto' }}
          >
            Logout
          </Button>
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
