import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Card, CardContent, Box, Link as MUILink } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState('');
  const [googleId, setGoogleId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); 
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      login(email, password); 
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  // const handleGoogleSuccess = (response) => {
  //   console.log(response);
  //   navigate('/dashboard');
  //   // Handle Google login logic here
  // };

  const handleGoogleSuccess = async (response) => {
    try {
      const token = response.credential;
      
      // Send token to your backend to handle Google login
      const googleResponse = await axios.post('http://localhost:5000/api/google-login', { token });
      
      // Store the JWT token in localStorage
      localStorage.setItem('token', googleResponse.data.token);
      
      // Get the current user details using the stored token
      const userResponse = await axios.get('http://localhost:5000/auth/current_user', {
        headers: {
          Authorization: `Bearer ${googleResponse.data.token}`, // Include token in the request header
        },
      });
      console.log(userResponse);
      
      // Set user details in the AuthContext
      const user = {

        googleId: userResponse.data.id,
        email: userResponse.data.email,
        name: userResponse.data.name,
      };
      setEmail(userResponse.data.email);
      setUser(user); // Set the user in the context
      
      await axios.post('http://localhost:5000/api/google-register', user);
      const response1 = await axios.post('http://localhost:5000/id', { email: user.email });
      console.log("Id:", response1.data.id); 
      const id = response1.data.id;
      user.id = response1.data.id;
      setUser(user);
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed', error);
    }
  };
  

  const handleGoogleFailure = (error) => {
    console.error('Google login failed', error);
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
    >
      <Card variant="outlined" sx={{ width: '100%', padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" align="center" gutterBottom>
            Login
          </Typography>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
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
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Login
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 2 }}>
            <Typography variant="body2" align="center">
              Don't have an account? <MUILink component={Link} to="/register">Signup</MUILink>
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
