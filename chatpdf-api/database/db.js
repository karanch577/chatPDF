import pg from "pg"
const { Pool } = pg

const pool = new Pool({
  user: 'myuser',
  host: 'localhost', 
  database: 'api',
  password: 'ChangeMe',
  port: 5432, 
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
