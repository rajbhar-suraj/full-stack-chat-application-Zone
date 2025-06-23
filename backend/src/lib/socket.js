import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    }
})

export const getRecieverSocketId = (userId) =>{
    return userSocketMap[userId]
}

// for online users
const userSocketMap = {} //userId = socketId

io.on("connection", (socket) => {
    // console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId  // query.userId coming from the frontedn
    if (userId) userSocketMap[userId] = socket.id //adding it in userSocketMap

    io.emit("getOnlineUser", Object.keys(userSocketMap)) //object means userSocketMap{} key is the user id //emit means reflecting in realtime

    socket.on("disconnect", () => {
        // console.log("A user disconnected", socket.id);
        delete userSocketMap[userId]; // removing from userSocketMap if users logsout
        io.emit("getOnlineUser", Object.keys(userSocketMap))
    })
})

export { io, server, app }