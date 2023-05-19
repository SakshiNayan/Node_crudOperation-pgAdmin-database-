const express = require('express');
const bodyParser = require('body-parser');
const {Pool} = require('pg')


const app = express();
const port = 3000;

// Configure bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'task_manage',
  password: 'Postsql@123',
  port: 5432,
});

// Create a new record
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
  const values = [name, email];

  try {
    const result = await pool.query(query, values);
    //console.log("hello",result);
    res.send.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    //console.log("error",error);
  }
});

// Get all records
app.get('/api', async (req, res) => {
  const query = 'SELECT * FROM users';

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single record by ID
app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a record
app.put('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3';
  const values = [name, email, id];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a record
app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM users WHERE id = $1';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
