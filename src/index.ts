// src/index.ts
import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectToDatabase from "./infrastructure/database/dbConnection";

// configs
config();
connectToDatabase();

const app = express();
const PORT = process.env.APP_PORT;

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
