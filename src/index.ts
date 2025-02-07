import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./firebase";
const app = express();
import { config } from "dotenv";
import connectToDatabase from "./infrastructure/database/dbConnection";
import authRoutes from "./infrastructure/routes/authRoutes";
import adminRoutes from "./infrastructure/routes/adminRoutes";
import tutorRoutes from "./infrastructure/routes/tutorRoutes";
import orderRoutes from "./infrastructure/routes/orderRoutes";
import courseRoutes from "./infrastructure/routes/courseRoutes";

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
app.use(express.urlencoded({ extended: true }));

app.use("/api/order", orderRoutes);
app.use("/api/course", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/tutor", tutorRoutes);
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
