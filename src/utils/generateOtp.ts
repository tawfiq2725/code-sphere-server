import { randomInt } from "crypto";

export function generateOtPO() {
  return randomInt(100000, 999999);
}
