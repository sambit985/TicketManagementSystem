const { parse } = require('querystring');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/conn');

const secretKey = 'asdbbhebdAJ';

async function handleRegister(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { username, password } = parse(body);

      // Get the database instance
      const db = getDb();

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'User already exists' }));
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      await db.collection('users').insertOne({ username, password: hashedPassword });

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'User registered successfully' }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Internal server error', error: error }));
    }
  });
}

async function handleLogin(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { username, password } = parse(body);

      // Get the database instance
      const db = getDb();

      // Find the user in the database
      const user = await db.collection('users').findOne({ username });
      if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Authentication failed' }));
        return;
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Authentication failed' }));
        return;
      }

      // Generate a JWT token
      const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ token }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Internal server error', error: error }));
    }
  });
}

async function handleLogout(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { token } = parse(body);

      // Verify the token
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Invalid token' }));
        } else {
          // Handle the logout logic (e.g., blacklisting the token, removing session data, etc.)
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ message: 'Logout successful' }));
        }
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Internal server error',error: error }));
    }
  });
}

module.exports = { handleRegister, handleLogin, handleLogout };
