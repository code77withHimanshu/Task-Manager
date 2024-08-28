import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import Logout from './components/Logout';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/logout" element={<Logout />} />
        {user ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
