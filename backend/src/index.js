import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoDb } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import {server,app} from './lib/socket.js';
import path from 'path';

dotenv.config()

const __dirname = path.resolve()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.get("/", (req, res) => {
    res.send("Server running");
  });

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname,"../frontend/dist")))

//     app.get("*",(req,res)=>{
//         res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
//     })
// }
if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "../frontend/dist");
    app.use(express.static(staticPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(staticPath, "index.html"));
    });
}

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    mongoDb()
})