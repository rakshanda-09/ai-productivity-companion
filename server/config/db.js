const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_productivity_companion";
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected -> ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`[db] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
