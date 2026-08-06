import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import AppDataSource from "./config/db.ts";
import {router as authRoute} from './routes/auth.routes.ts'
import {router as medicineRoute} from './routes/medicine.routes.ts'
import { authCheck } from "./middleware/auth.middleware.ts";
import {router as inventoryRoute} from './routes/inventory.routes.ts'
import {router as customerRoute} from './routes/customer.routes.ts'
import {router as salesRoute} from './routes/sales.routes.ts'
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import expiryDateCron from "./utils/expiryDateCron.ts";
import {router as notificationRoute} from './routes/notification.routes.ts'

dotenv.config();

const app = express()

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "apollo-require-preflight",
          "x-apollo-operation-name",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    }),
)
app.use(express.json())

app.use('/', authCheck, authRoute)
app.use('/api', authCheck, medicineRoute)
app.use('/api', authCheck, inventoryRoute)
app.use('/api', authCheck, customerRoute)
app.use('/api', authCheck, salesRoute)
app.use('/api', authCheck, notificationRoute)

const server = http.createServer(app)
export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "apollo-require-preflight",
          "x-apollo-operation-name",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    }
})

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined room: ${userId}`)
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
    })
})

const port = process.env.PORT
server.listen(port, async () => {
    try{
        await AppDataSource.initialize()
        console.log('Connected to database')

        expiryDateCron()

        console.log(`Server listening at http://localhost:${port}`)
    }
    catch(err: any){
        console.log('Database initialization failed:', err.message)
    }
})
