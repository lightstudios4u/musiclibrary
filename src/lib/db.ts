import mysql from "mysql2/promise";

// Ensure required environment variables are present
if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error(
    "❌ Missing database environment variables! Check your .env.local file."
  );
}

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 25060, // Default MySQL port is 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
