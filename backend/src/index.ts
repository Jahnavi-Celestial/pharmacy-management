import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import AppDataSource from "./config/db.ts";
import {router as authRoute} from './routes/auth.routes.ts';
import {router as medicineRoute} from './routes/medicine.routes.ts';
import { authCheck } from "./middleware/auth.middleware.ts";
import {router as inventoryRoute} from './routes/inventory.routes.ts';
import {router as customerRoute} from './routes/customer.routes.ts';
import {router as salesRoute} from './routes/sales.routes.ts';
import cors from 'cors';
import expiryDateCron from "./utils/expiryDateCron.ts";
import {router as notificationRoute} from './routes/notification.routes.ts';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        allowedHeaders: [
          "Content-Type",
          "Authorization",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);
app.use(express.json());

app.use('/api', authRoute);
app.use('/api', authCheck, medicineRoute);
app.use('/api', authCheck, inventoryRoute);
app.use('/api', authCheck, customerRoute);
app.use('/api', authCheck, salesRoute);
app.use('/api', authCheck, notificationRoute);

const port = process.env.PORT;
app.listen(port, async () => {
    try{
        await AppDataSource.initialize();
        console.log('Connected to database');

        expiryDateCron();

        console.log(`Server listening at http://localhost:${port}`);
    }
    catch(err: any){
        console.log('Database initialization failed:', err.message);
    }
});
