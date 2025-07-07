const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // ADD THIS LINE - Missing User model import
const router = express.Router();

// Pre-create demo user with known hashed password (for fallback)
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

// Registration endpoint - stores user in MongoDB
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user (password will be hashed automatically by User model)
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      role: 'user'
    });

    await newUser.save();
    console.log('✅ New user registered:', username);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login endpoint - only authenticates existing users
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username }); // Don't log password
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find user by username or email in MongoDB
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    console.log('Found user:', user ? 'Yes' : 'No');

    // Compare password with stored hash using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password match:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', username);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'legal-dms-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', username, `(${user.role})`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Get all users from MongoDB - ADD THIS MISSING ENDPOINT
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users' 
    });
  }
});

// Create default admin user
router.post('/create-admin', async (req, res) => {
  try {
    console.log('🔧 Starting admin creation process...');
    
    const adminExists = await User.findOne({ role: 'admin' });
    console.log('🔧 Admin exists check:', adminExists ? 'Yes' : 'No');
    
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    console.log('🔧 Creating new admin user...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@legaldms.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('🔧 Saving admin user to database...');
    await adminUser.save();
    console.log('✅ Admin user created successfully');

    res.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('❌ Detailed error creating admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

// Create default demo user
router.post('/create-demo', async (req, res) => {
  try {
    const demoExists = await User.findOne({ username: 'demo' });
    
    if (demoExists) {
      return res.status(400).json({
        success: false,
        message: 'Demo user already exists'
      });
    }

    const demoUser = new User({
      username: 'demo',
      email: 'demo@legaldms.com',
      password: 'demo123',
      role: 'user'
    });

    await demoUser.save();

    res.json({
      success: true,
      message: 'Demo user created successfully',
      user: {
        username: demoUser.username,
        email: demoUser.email,
        role: demoUser.role
      }
    });

  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating demo user' 
    });
  }
});

// Debug endpoint to see in-memory users (for fallback)
router.get('/debug/users', (req, res) => {
  res.json({ 
    inMemoryUsers: users.map(u => ({ 
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

  jwt.verify(token, process.env.JWT_SECRET || 'legal-dms-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { router, authenticateToken };