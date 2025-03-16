import express from "express";
import { createServer } from "http";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import connectToDatabase from "./infrastructure/database/dbConnection";
import authRoutes from "./infrastructure/routes/authRoutes";
import adminRoutes from "./infrastructure/routes/adminRoutes";
import tutorRoutes from "./infrastructure/routes/tutorRoutes";
import orderRoutes from "./infrastructure/routes/orderRoutes";
import courseRoutes from "./infrastructure/routes/courseRoutes";
import reportRoutes from "./infrastructure/routes/reportsRoute";
import { configFrontend } from "./config/ConfigSetup";
import { initSocket } from "./config/socketConfig";
config();
const PORT = process.env.APP_PORT || 4000;

const corsOptions = {
  origin: configFrontend.frontendUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = initSocket(server);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/reports", reportRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/course", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/tutor", tutorRoutes);
app.use("/", authRoutes);

const startServer = async () => {
  try {
    await connectToDatabase();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
