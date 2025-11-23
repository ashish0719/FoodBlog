const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connectionString = process.env.CONNECTION_STRING;
    
    if (!connectionString) {
      console.error("❌ ERROR: CONNECTION_STRING is not defined in .env file");
      console.log("💡 Please create a .env file in the backend directory with:");
      console.log("   CONNECTION_STRING=mongodb://localhost:27017/foodrecipe");
      console.log("   OR");
      console.log("   CONNECTION_STRING=your-mongodb-atlas-connection-string");
      process.exit(1);
    }

    await mongoose.connect(connectionString);
    console.log("✅ MongoDB connection successful");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("\n💡 Troubleshooting tips:");
    console.log("1. Check if MongoDB is running (for local)");
    console.log("2. Verify your connection string in .env file");
    console.log("3. For MongoDB Atlas:");
    console.log("   - Check if cluster is running (not paused)");
    console.log("   - Verify IP whitelist includes your IP (0.0.0.0/0 for all)");
    console.log("   - Check database user credentials");
    console.log("   - Verify network access settings");
    console.log("\n📝 Example .env file:");
    console.log("   CONNECTION_STRING=mongodb://localhost:27017/foodrecipe");
    console.log("   PORT=8000");
    console.log("   SECERET_KEY=your-secret-key");
    process.exit(1);
  }
};

module.exports = connectDb;
