require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      console.log(error)
    }
  }

module.exports = connectDB;