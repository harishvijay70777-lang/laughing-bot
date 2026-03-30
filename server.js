const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Safe DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Create table safely
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        name TEXT,
        class TEXT,
        timing TEXT
      )
    `);
    console.log("Table ready ✅");
  } catch (err) {
    console.error("DB Error:", err);
  }
})();

// Register route
app.post("/register", async (req, res) => {
  const { name, class: userClass, timing } = req.body;

  try {
    await pool.query(
      "INSERT INTO registrations (name, class, timing) VALUES ($1, $2, $3)",
      [name, userClass, timing]
    );

    res.send("Registration Successful 🎉");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving data");
  }
});

// Start server (VERY IMPORTANT)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS)
app.use(express.static(path.join(__dirname)));

// Show index.html on homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/register", (req, res) => {
  res.send("Data received successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));