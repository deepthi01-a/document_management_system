const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Pre-create demo user with known hashed password
const users = [];

// Helper function to create demo user on startup
async function createDemoUser() {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  users.push({
    id: 1,
    username: 'demo',
    email: 'demo@example.com',
    password: hashedPassword,
    createdAt: new Date().toISOString()
  });
}

// Create demo user when server starts
createDemoUser();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: users.length + 1,
      username,
      email: email || '',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password }); // Debug log
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    // Find user
    const user = users.find(u => u.username === username);
    console.log('Found user:', user ? 'Yes' : 'No'); // Debug log
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Debug log
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Debug endpoint to see all users
router.get('/debug/users', (req, res) => {
  res.json({ 
    users: users.map(u => ({ 
      id: u.id, 
      username: u.username, 
      email: u.email,
      hasPassword: !!u.password 
    })) 
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateToken };
