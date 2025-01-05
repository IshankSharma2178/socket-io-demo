import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [recieveMessages, setRecieveMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message", { message, room });
      setMessage("");
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("🔗 Connected to server");
      console.log("🆔 Socket ID:", newSocket.id);
      setSocketId(newSocket.id);
    });

    newSocket.on("welcome", (message) => {
      console.log(message);
    });

    newSocket.on("recieve-data", (msg) => {
      setRecieveMessages([...recieveMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" component="div" gutterBottom>
          Connecting to socket...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Welcome to socket.io
      </Typography>
      {socketId && (
        <Typography variant="h6" component="div" gutterBottom>
          Socket ID: {socketId}
        </Typography>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basic"
            label="Message"
            variant="outlined"
          />
          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            id="outlined-basic"
            label="Room"
            variant="outlined"
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </div>
      </form>
      <div style={{ marginTop: "20px" }}>
        {recieveMessages.map((msg, index) => (
          <Typography key={index} variant="body1" component="div" gutterBottom>
            {msg}
          </Typography>
        ))}
      </div>
    </Container>
  );
};

export default App;
