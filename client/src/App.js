import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [recieveMessages, setRecieveMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("message-private", { userName, message, room });
      setMessage("");
    }
  };

  const CreateRoomHandler = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("create-room", { roomName });
      setRoomName("");
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
      console.log(msg);
      setRecieveMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-neon-green">
        <h1 className="text-3xl font-bold animate-pulse">
          Connecting to socket...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-neon-green flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 neon-text text-center text-sky-50">
        Realtime ChatApp using Socket.IO
      </h1>
      {socketId && (
        <p className="text-lg mb-6 bg-gray-800 px-4 py-2 text-sky-50 rounded-md shadow-lg">
          🆔 Socket ID:{" "}
          <span className="font-mono text-neon-pink">{socketId}</span>
        </p>
      )}
      <div className="flex w-[1200px] max-w-[90%] h-[100%] space-x-4 flex-wrap items-center justify-center">
        <form
          onSubmit={CreateRoomHandler}
          className="w-full max-w-md bg-gray-800 h-[100%] p-6 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-xl mb-4 neon-text text-sky-50">Create Room</h2>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Room Name"
            className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-neon-pink text-white font-bold hover:bg-neon-purple transition-all"
          >
            Create Room
          </button>
        </form>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl mb-4 neon-text text-sky-50">Send Message</h2>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter Your Name"
            className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Message"
            className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter Room"
            className="w-full p-2 mb-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-neon-blue text-white font-bold hover:bg-neon-purple transition-all"
          >
            Send Message
          </button>
        </form>
      </div>

      <h2 className="mt-8 text-xl mb-4 neon-text text-sky-50 ">Messages</h2>
      <div className=" w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-md overflow-auto h-60">
        <div className="space-y-2">
          {recieveMessages.map((msg, index) => (
            <div
              key={index}
              className="bg-gray-700 px-3 py-2 rounded-md shadow-md text-white"
            >
              <strong className="text-xs text-stone-400">
                {msg.userName} :
              </strong>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
