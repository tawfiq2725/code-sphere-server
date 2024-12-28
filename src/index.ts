// src/index.ts
import express from "express";
import cors from "cors";
import { config } from "dotenv";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
