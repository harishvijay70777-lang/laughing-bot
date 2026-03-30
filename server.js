const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// PostgreSQL (Railway)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Register route
app.post("/register", async (req, res) => {
  const { name, email, className, timing } = req.body;

  try {
    await pool.query(
      "INSERT INTO registrations (name, email, class_name, timing) VALUES ($1, $2, $3, $4)",
      [name, email, className, timing]
    );

    res.send("😂 Registered successfully! Get ready to laugh!");
  } catch (err) {
    console.error(err);
    res.send("❌ Error saving data");
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));