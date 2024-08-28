import React from 'react';
import { Button, Container, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container 
      maxWidth="sm" 
      style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <Grid 
        container 
        direction="column" 
        alignItems="center" 
        spacing={3}
      >
        <Grid item>
          <Typography variant="h3" component="h1" align="center">
            Welcome to the Task Manager App
          </Typography>
        </Grid>
        <Grid item>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary" 
            size="large"
            fullWidth
          >
            Login
          </Button>
        </Grid>
        <Grid item>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            color="success" 
            size="large"
            fullWidth
          >
            Signup
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
