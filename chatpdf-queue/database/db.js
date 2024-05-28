// db.js
import pg from "pg"
const { Pool } = pg

const pool = new Pool({
  user: 'myuser',
  host: 'localhost', 
  database: 'api',
  password: 'ChangeMe',
  port: 5432, 
});


export default pool
