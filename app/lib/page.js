"use client"; // Mark this file as a Client Component

import React, { useState } from 'react';
import { Box, Stack, Button, TextField, Typography } from '@mui/material';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { auth } from "../firebase"; // Import the firebase auth instance

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(''); // State to hold error messages

  const router = useRouter(); // Initialize the useRouter hook

  const handleLogin = async () => {
    try {
      console.log('Attempting login with email:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      setUser({ email });
      router.push('/chat'); // Redirect to /chat/chatPage after login
    } catch (error) {
      console.error('Login failed:', error.code, error.message);
      setError(`Login failed: ${error.message}`); // Set error message
    }
  };

  const handleSignup = async () => {
    try {
      console.log('Attempting signup with email:', email);
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful');
      setUser({ email });
      router.push('/page'); // Redirect to /lib/SignupModal after signup
    } catch (error) {
      console.error('Signup failed:', error.code, error.message);
      setError(`Signup failed: ${error.message}`); // Set error message
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting logout');
      await signOut(auth);
      console.log('Logout successful');
      setUser(null);
      router.push('/page'); // Redirect to /chatPage after logout
    } catch (error) {
      console.error('Logout failed:', error.code, error.message);
      setError(`Logout failed: ${error.message}`); // Set error message
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: 'linear-gradient(to right, #ff7e5f, #feb47b)', // Gradient background
        overflow: 'hidden', // Prevent scrolling
        position: 'relative',
      }}
    >
      <Box
        width="360px"
        p={4}
        borderRadius="16px"
        boxShadow={3}
        bgcolor="white"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          {user ? 'Welcome Back!' : 'Login'}
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          {user ? 'You are logged in. Click below to logout.' : 'Please enter your details to log in or sign up.'}
        </Typography>

        {!user ? (
          <>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" marginY={2}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ mb: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleSignup}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AuthPage;
