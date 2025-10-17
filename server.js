import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let players = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("join", (data) => {
    players[data.id] = data;
    io.emit("state", Object.values(players));
  });

  socket.on("update", (data) => {
    if (players[data.id]) players[data.id] = data;
    io.emit("state", Object.values(players));
  });

  socket.on("disconnect", () => {
    for (const id in players) {
      if (players[id].socketId === socket.id || players[id].id === socket.id) {
        delete players[id];
      }
    }
    io.emit("state", Object.values(players));
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(3000, () => console.log("🌎 Multiplayer server running on port 3000"));
