import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AuthError } from "../classes/AuthError.js";
import { asyncCompare, asyncCrypt } from "../utils.js";
import { config as configDotenv } from "dotenv";

configDotenv();

const jwtDuration = process.env.JWT_DURATION ?? "13h";

export const login = async (email, password) => {
  try { 
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new AuthError(404, "User not found");

    const isMatch = await asyncCompare(password, user.password);
    if (!isMatch) throw new AuthError(403, "Invalid email or password");
    
    return jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: jwtDuration }); 
  } catch (e) {
    throw new AuthError(404, e.message);
  }
};

export const register = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) throw new AuthError(400, "User already exists");

    await User.create({
      email: email,
      password: await asyncCrypt(password),
    });

    return login(email, password);
  } catch (e) {
    throw new AuthError(400, e.message);
  }
};