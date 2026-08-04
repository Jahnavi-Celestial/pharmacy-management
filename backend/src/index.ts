import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express()

app.use(express.json())

const port = process.env.PORT
app.listen(() => {
    console.log(`Server listening at http://localhost:${port}`)
})
