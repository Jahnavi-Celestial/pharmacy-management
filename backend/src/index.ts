import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import AppDataSource from "./config/db.ts";

dotenv.config();

const app = express()

app.use(express.json())

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
