import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    entities: ["./src/entities/*.ts"],
    url: process.env.DB_URL || "",
    synchronize: true
})

export default AppDataSource;