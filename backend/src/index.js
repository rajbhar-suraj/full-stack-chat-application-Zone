import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mongoDb } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cookieParser from 'cookie-parser';
import {server,app} from './lib/socket.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config()


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const frontendPath = path.resolve(__dirname, '../../frontend/dist')

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(frontendPath))

    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'))
    })
}

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    mongoDb()
})