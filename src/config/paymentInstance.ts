import { config } from "dotenv";
config();
import Razorpay from "razorpay";

export const razorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});
