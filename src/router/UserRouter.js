import { Router } from "express";
import { updateProfile, patchPassword } from "../controllers/UserController.js";
import { asyncHandler } from "../AsyncHandler.js";
import upload from '../../multerConfig.js';

const userRouter = Router();

userRouter.put('/photo', upload.single('image'), asyncHandler(async (req, res, next) => {
  try {
    const img = req.body.base64_image;
    if (!req.file && !img) throw new Error("No file uploaded");
    const userID = req.user.dataValues.id;
    let photo = null;
    if (req.file) {
      console.log("req.file uploaded");
      photo = req.file.filename;
    }
    if (img) {
      console.log("base64 uploaded");
      photo = img;
    }
    const token = await updateProfile(userID, null, null, null, photo);

    res.status(200).json({ jwt: token, message: "Photo uploaded" });
  } catch (e) {
    next(e);
  }
}));

userRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const { firstname, lastname, email, photo } = req.body;
    const userID = req.user.dataValues.id;
    const updatedFirstname = firstname ?? req.user.firstname;
    const updatedLastname = lastname ?? req.user.lastname;
    const updatedEmail = email ?? req.user.email;
    const updatedPhoto = photo ?? req.user.photo;
    const token = await updateProfile(
      userID,
      updatedFirstname,
      updatedLastname,
      updatedEmail,
      updatedPhoto,
    );
    res.status(200).json({ jwt: token, message: "Profile updated" });
  })
);

userRouter.patch(
  "/password",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    await patchPassword(userID, oldPassword, newPassword, confirmPassword);
    res.status(200).json({ message: "Password updated, login needed" });
  })
);

userRouter.delete(
  "/",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    await deleteUser(userID);
    res.status(200).json({ message: "User deleted" });
  })
);

export default userRouter;
