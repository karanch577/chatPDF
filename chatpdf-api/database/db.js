import pg from "pg"
const { Pool } = pg

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST, 
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT, 
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');
    console.log('Extension "vector" ensured');
  } catch (error) {
    console.error('Error ensuring extension "vector":', error);
  } finally {
    client.release();
  }
}

initializeDatabase();

export default pool
