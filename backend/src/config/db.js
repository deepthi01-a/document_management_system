require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Skip database connection in test/CI environments
    if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
      console.log('🧪 Test environment detected - skipping database connection');
      return;
    }
    
    const connectionString = process.env.MONGO_URI;
    
    if (!connectionString) {
      console.log('⚠️ No MongoDB URI found - skipping database connection');
      return;
    }
    
    const conn = await mongoose.connect(connectionString);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Don't exit in test/CI environments - just log and continue
    if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
      console.log('⚠️ Database connection failed in test environment - continuing without database');
      return;
    }
    
    // Only exit in production/development
    process.exit(1);
  }
};

module.exports = connectDB;
