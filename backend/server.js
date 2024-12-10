const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3001" }));

// Connect to SQLite database
const db = new sqlite3.Database("./backend/database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create `users` table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creating users table:", err);
    } else {
      console.log("Users table is ready");
    }
  });

  // Create `tasks` table
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task TEXT NOT NULL,
      importance TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating tasks table:", err);
    } else {
      console.log("Tasks table is ready");
    }
  });
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

// Signup endpoint
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Server error");
    }

    // Insert user into the database
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(400).send("Username already exists");
          }
          console.error("Error inserting user:", err);
          return res.status(500).send("Server error");
        }
        res.status(201).send("User created successfully");
      }
    );
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Check if the username exists
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Server error");
    }

    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Server error");
      }

      if (!isValid) {
        return res.status(403).send("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username }, "your_jwt_secret", {
        expiresIn: "1h",
      });

      res.json({ token });
    });
  });
});

// GET /tasks - Fetch tasks for a user
app.get("/tasks", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).send("Server error");
    }
    res.json(rows);
  });
});

// POST /tasks - Add a new task
app.post("/tasks", authenticateToken, (req, res) => {
  const { task, importance, date } = req.body;
  const userId = req.user.id;

  if (!task || !importance || !date) {
    return res.status(400).send("All fields are required");
  }

  db.run(
    "INSERT INTO tasks (user_id, task, importance, date) VALUES (?, ?, ?, ?)",
    [userId, task, importance, date],
    function (err) {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).send("Server error");
      }
      res.status(201).json({ id: this.lastID, task, importance, date });
    }
  );
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
