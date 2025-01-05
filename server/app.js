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

io.on("connection", (socket) => {
  console.log("user connected");
  console.log("user id" + socket.id);
  socket.broadcast.emit("welcome", "welcome message sent");
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
  socket.on("message", (msg) => {
    console.log("message: " + msg);
    socket.broadcast.emit("recieve-data", msg.message);
  });
});

server.listen(PORT, () => {
  console.log("server listening on port " + PORT);
});
