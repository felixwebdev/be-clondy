import { Server } from "socket.io";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

const userSocketMap = new Map();

export let io;

export const initSocket = (server) => {
  io = new Server(server,{ cors: {origin: "*"}});

  io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.id; 
    next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected:" + socket.id + "with userId " + socket.userId);
    userSocketMap.set(socket.userId, socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.userId);
        userSocketMap.delete(socket.userId);
    });
  });
};


export function getSocketIdByUserId(userId) {
  return userSocketMap.get(userId);
}