import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Card, CardContent, Box, Divider } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/register', { firstName, lastName, email, password, confirmPassword });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const handleGoogleSignup = async (response) => {
    try {
      const { credential } = response;
      // Sending Google token to backend for authentication
      await axios.post('/auth/google', { idToken: credential });
      navigate('/');
    } catch (error) {
      console.error('Google Sign Up Error:', error);
    }
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
    >
      <Card variant="outlined" sx={{ width: '100%', padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            Signup
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Last Name"
              variant="outlined"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Signup
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Login
              </Link>
            </Typography>
          </Box>
          <Divider sx={{ margin: '16px 0' }} />
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Or sign up with Google
            </Typography>
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={(error) => console.error('Google Sign Up Error:', error)}
              style={{ marginTop: '16px' }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Register;
