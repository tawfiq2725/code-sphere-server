// src/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { config } from "dotenv";
import connectToDatabase from "./infrastructure/database/dbConnection";
import authRoutes from "./infrastructure/routes/authRoutes";
config();
connectToDatabase();
const PORT = process.env.APP_PORT;

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
