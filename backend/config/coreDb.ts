import mongoose from 'mongoose';

const connectToDatabase = () => {
    const mongoUri = process.env.DB_URL || ""
    mongoose.connect(mongoUri)
    .then(() => {
      console.log(`DB CONNECTED: ${process.env.NODE_ENV} `)
    })
    .catch(error => {
      console.log('DB CONNECTION ISSUES');
      console.log(error);
      process.exit(1);
    });
  };

export default connectToDatabase;