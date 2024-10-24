import jwt from "jsonwebtoken";
import { AuthError } from "../classes/AuthError.js";

export const auth = (req, res, next) => {
  const { headers } = req;
  const token = headers?.authorization?.split(" ")[1] ?? "";
  if (token) {
    try {
      const user = jwt.decode(token, process.env.JWT_SECRET);
      req.user = { ...user };
      next();
    } catch (err) {
      throw new AuthError(401, "Authentification KO !");
    }
  } else {
    throw new AuthError(401, "Authenfication needed !");
  }
};
