import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Load environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'default_secret';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);

// MongoDB Connection
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not set in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on("error", (err) =>
  console.error("❌ MongoDB error:", err)
);
mongoose.connection.on("disconnected", () =>
  console.warn("⚠️ MongoDB disconnected")
);

app.get('/callback', async (req, res) => {
  try {
    console.log("callback", req);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
