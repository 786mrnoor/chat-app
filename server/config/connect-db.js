import mongoose from 'mongoose';

import logger from '../helpers/logger.js';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // autoIndex: false,
    });
    const connection = mongoose.connection;

    connection.on('connected', () => {
      logger.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
  }
}

// mongoose.set('debug', true);

export default connectDB;
