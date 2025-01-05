import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 4000;

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello world");
});

// io.use((socket, next) => {});

io.on("connection", (socket) => {
  console.log("user connected");
  console.log("user id" + socket.id);

  socket.broadcast.emit("welcome", "welcome message sent");

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });

  socket.on("message-private", (msg) => {
    socket.join(msg.room);
    const payload = { message: msg.message, userName: msg.userName };
    io.to(msg.room).emit("recieve-data", payload);
  });

  socket.on("create-room", (msg) => {
    socket.join(msg.roomName);
  });
});

server.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
