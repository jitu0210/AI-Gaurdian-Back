import jwt from "jsonwebtoken"
import dotenv, { config } from "dotenv"

dotenv.config();

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export {
    generateAccessToken,
    generateRefreshToken
}
