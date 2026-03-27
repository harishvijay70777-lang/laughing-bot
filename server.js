const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Railway DB connection (we update later)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Create table
pool.query(`
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  name TEXT,
  class TEXT,
  timing TEXT
);
`);

// API
app.post('/register', async (req, res) => {
  const { name, className, timing } = req.body;

  await pool.query(
    'INSERT INTO registrations(name, class, timing) VALUES($1,$2,$3)',
    [name, className, timing]
  );

  res.send("Registration Successful");
});

app.listen(3000, () => console.log("Server running on port 3000"));
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});