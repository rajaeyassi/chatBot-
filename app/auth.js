"use client"; // Mark this file as a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+
import { Box, Stack, Button, TextField } from '@mui/material';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from './firebase';
import { auth } from './auth'; // Ensure this path is correct

const AuthPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser({ email });
      router.push('/chat'); // Navigate to /chat after login
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUser({ email });
      router.push('/chat'); // Navigate to /chat after signup
    } catch (error) {
      console.error('Signup failed:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Stack direction={'column'} width="300px" p={2} spacing={3} borderRadius={8}>
        {!user ? (
          <>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleLogin}>
              Login
            </Button>
            <Button variant="contained" onClick={handleSignup}>
              Signup
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default AuthPage;
