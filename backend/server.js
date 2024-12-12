const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to SQLite database
const db = new sqlite3.Database('./backend/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// ... (other table creation and authentication middleware)

// GET /tasks - Fetch tasks for a user
app.get('/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Server error');
    }
    res.json(rows);
  });
});

// POST /tasks - Add a new task
app.post('/tasks', authenticateToken, (req, res) => {
  const { task, importance, date } = req.body;
  const userId = req.user.id;

  if (!task || !importance || !date) {
    return res.status(400).send('All fields are required');
  }

  db.run(
    'INSERT INTO tasks (user_id, task, importance, date, done) VALUES (?, ?, ?, ?, 0)',
    [userId, task, importance, date],
    function (err) {
      if (err) {
        console.error('Error inserting task:', err);
        return res.status(500).send('Server error');
      }
      res.status(201).json({ id: this.lastID, task, importance, date, done: 0 });
    }
  );
});

// PUT /tasks/:id - Update the "done" status of a task
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  if (done === undefined) {
    return res.status(400).send('Done status is required');
  }

  db.run(
    'UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?',
    [done, id, req.user.id],
    function (err) {
      if (err) {
        console.error('Error updating task:', err);
        return res.status(500).send('Server error');
      }
      if (this.changes === 0) {
        return res.status(404).send('Task not found');
      }
      // Fetch the updated task to return as a response
      db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, updatedTask) => {
        if (err) {
          console.error('Error fetching updated task:', err);
          return res.status(500).send('Server error');
        }
        res.status(200).json(updatedTask); // Send back the updated task
      });
    }
  );
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id], (err) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).send('Server error');
    }
    if (this.changes === 0) {
      return res.status(404).send('Task not found');
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// ... (other routes)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});