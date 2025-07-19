import jwt from "jsonwebtoken"
import dotenv, { config } from "dotenv"

dotenv.config();

const generateAccessToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export {
    generateAccessToken,
    generateRefreshToken
}
