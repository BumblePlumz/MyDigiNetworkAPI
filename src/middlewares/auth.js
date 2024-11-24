import jwt from "jsonwebtoken";
import { AuthError } from "../classes/AuthError.js";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  const { headers } = req;
  const token = headers?.authorization?.split(" ")[1] ?? "";
  if (!token) next(new AuthError(401, "Unauthorized"));
  try {
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    const id = jwtUser.dataValues.id;
    const dbUser = await User.findByPk(id);
    if (!dbUser) throw new AuthError(404, "User doesn't exist !");
    req.user = { ...jwtUser };
    next();
  } catch (err) {
    next(new AuthError(401, "Unauthorized"));
  }
};
