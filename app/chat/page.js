"use client"; // Add this line to mark the file as a Client Component
import React, { useState, useEffect, useRef } from "react";
import { Box, Stack, Button, TextField } from "@mui/material";
import Typography from '@mui/material/Typography';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from "../firebase";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am HeadStarter Support Assistant. How can I assist you today?"
    },
  ]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatFinished, setChatFinished] = useState(false); // Track if chat is finished
  const router = useRouter();

  const sendMessage = async () => {
    if (!message.trim() || isLoading) {
      return;
    }
    setIsLoading(true);

    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error: ", error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I am sorry, I encountered an error. Please try again later." }
      ]);
    }

    setIsLoading(false);

    // Mark chat as finished when the assistant responds with a final message
    if (message.toLowerCase() === "bye") {
      setChatFinished(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home or login page after logout
    } catch (error) {
      console.error('Logout failed:', error.code, error.message);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: '#050107', // Fallback background color
        position: 'relative'
      }}
    >
      <Box
        width="600px" 
        height="800px" 
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: 'url("https://media0.giphy.com/media/58OujxlE7e19Mjv0gj/200w.gif?cid=6c09b952k0q2dm8vckukv4g1lucvp572scddlmla7dg3b4l4&ep=v1_gifs_search&rid=200w.gif&ct=g")',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />

      <Stack
        direction="column"
        width="380px" 
        height="650px"
        border="1px solid #4caf50"
        p={1}
        spacing={3}
        borderRadius={20}
        bgcolor="white"
        sx={{ 
          boxShadow: 3, 
          position: 'relative', 
          marginRight: '100px' 
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          mb={3}
        >
          <Typography variant="h6" color="primary.main">
            Chat with AI Bot
          </Typography>
        </Box>

        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
              p={1}
            >
              <Box
                bgcolor={message.role === "assistant" ? "#cfd8dc" : "#4caf50"}
                color="black"
                borderRadius={16}
                p={2} 
                maxWidth="70%"
                sx={{ wordWrap: 'break-word' }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          mt={2}
          sx={{ position: 'absolute', bottom: 0, width: '380px', padding: 3 }}
        >
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            variant="outlined"
            sx={{ bgcolor: "white" }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            color="success"
            sx={{ height: '100%' }}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Stack>

        {/* Logout Button */}
        <Box
          position="absolute"
          bottom={16}
          left="120%"
          transform="translateX(-50%)"
          width="80%"
          mt={2}
        >
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
