require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the MONGO_URI from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
