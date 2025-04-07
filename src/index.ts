import express, { NextFunction, Request, Response } from "express";
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
import fs from "fs";
import * as rfs from "rotating-file-stream";
import path from "path";
config();
const PORT = process.env.APP_PORT || 4000;

const allowOrigins = [
  configFrontend.frontendUrl,
  configFrontend.frontendUrlProd,
  configFrontend.frontendUrlProdNew,
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const server = createServer(app);
const io = initSocket(server);
const logDirectory = path.join(__dirname, `logs`);
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const errorLogstream = rfs.createStream("error.log", {
  interval: `1d`,
  path: logDirectory,
  maxFiles: 7,
});

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(
  logger("combined", {
    stream: errorLogstream,
    skip: (req: Request, res: Response) => res.statusCode < 400,
  })
);

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
