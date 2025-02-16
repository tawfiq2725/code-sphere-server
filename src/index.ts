import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./firebase";
import { config } from "dotenv";
import connectToDatabase from "./infrastructure/database/dbConnection";
import authRoutes from "./infrastructure/routes/authRoutes";
import adminRoutes from "./infrastructure/routes/adminRoutes";
import tutorRoutes from "./infrastructure/routes/tutorRoutes";
import orderRoutes from "./infrastructure/routes/orderRoutes";
import courseRoutes from "./infrastructure/routes/courseRoutes";
import MembershipOrder from "./infrastructure/database/order-mSchema";
import cron from "node-cron";

config();
connectToDatabase();
const PORT = process.env.APP_PORT;

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/order", orderRoutes);
app.use("/api/course", courseRoutes);
app.use("/admin", adminRoutes);
app.use("/tutor", tutorRoutes);
app.use("/", authRoutes);

cron.schedule("0 0 * * *", async () => {
  console.log("Running membership status update job...");

  try {
    const currentDate = new Date();
    const result = await MembershipOrder.updateMany(
      {
        membershipEndDate: { $lt: currentDate },
        membershipStatus: "active",
      },
      { $set: { membershipStatus: "inactive" } }
    );
    console.log(`Updated ${result.modifiedCount} membership(s) to inactive.`);
  } catch (error) {
    console.error("Error updating membership status:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
