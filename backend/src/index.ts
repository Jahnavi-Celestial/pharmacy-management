import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import AppDataSource from "./config/db.ts";
import {router as authRoute} from './routes/auth.routes.ts'
import {router as medicineRoute} from './routes/medicine.routes.ts'
import { authCheck } from "./middleware/auth.middleware.ts";

dotenv.config();

const app = express()

app.use(express.json())

app.use('/', authCheck, authRoute)
app.use('/api',  authCheck, medicineRoute)

const port = process.env.PORT
app.listen(port, async () => {
    try{
        await AppDataSource.initialize()
        console.log('Connected to database')
        console.log(`Server listening at http://localhost:${port}`)
    }
    catch(err: any){
        console.log('Database initialization failed:', err.message)
    }
})
