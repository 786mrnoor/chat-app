import mongoose from 'mongoose';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: false,
    });
    const connection = mongoose.connection;

    connection.on('connected', () => {
      // console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      // console.error('MongoDB connection error:', err);
    });
  } catch (error) {
    // console.error('MongoDB connection failed:', error);
  }
}

// mongoose.set('debug', true)

export default connectDB;
