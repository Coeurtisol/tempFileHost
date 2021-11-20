import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE,
});

export default pool;
