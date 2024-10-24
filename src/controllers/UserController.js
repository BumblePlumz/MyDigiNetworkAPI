import { User } from "../models/User.js";
import { UserError } from "../classes/UserError.js";
import { asyncCompare, asyncCrypt, saveImageFromBase64 } from "../utils.js";
import jwt from "jsonwebtoken";
import { config as configDotenv } from "dotenv";

configDotenv();
const jwtDuration = process.env.JWT_DURATION;

export const updateProfile = async (id, firstname, lastname, email, photo) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new UserError(404, "User not found");
        if (user.id !== id) throw new UserError(403, "Unauthorized to update user");
        
        if (firstname && firstname.trim() !== "") user.firstname = firstname;
        if (lastname && lastname.trim() !== "") user.lastname = lastname;
        if (email && email.trim() !== "") user.email = email;
        if (photo && photo.trim() !== "") {
            saveImageFromBase64(photo);
            user.photo = photo;
        }

        await user.save();
        let token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: jwtDuration }); 
        return token;
    } catch (e) {
        throw new UserError(e.code || 500, e.message);
    }
};

export const patchPassword = async (id, oldPassword, newPassword, confirmPassword) => {
    try {
        console.log("patchPassword");
        if (!oldPassword || !newPassword || !confirmPassword) throw new UserError(400, "Password and New Password with confirmation are required");
        if (newPassword !== confirmPassword) throw new UserError(400, "Password and Confirm Password do not match");

        const user = await User.findByPk(id);
        if (!user) throw new UserError(404, "User not found");
        if (user.id !== id) throw new UserError(403, "Unauthorized to update user");
        
        const isMatch = await asyncCompare(oldPassword, user.password);
        if (!isMatch) throw new UserError(403, "Old password is incorrect");

        user.password = await asyncCrypt(confirmPassword);
        await user.save();
    } catch (e) {
        throw new UserError(e.code || 500, e.message);
    }
};

export const deleteUser = async (id) => {
    try {
        await User.destroy({ where: { id: id } });
    } catch (e) {
        throw new UserError(e.code || 500, error.message);
    }
};

