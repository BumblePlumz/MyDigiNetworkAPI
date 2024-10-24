import { Router } from 'express';
import { asyncHandler } from './AsyncHandler.js';
import { register, login } from '../controllers/AuthController.js';
import { AuthError } from '../classes/AuthError.js';

const authRouter = Router();

authRouter.post('/register', asyncHandler( async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new AuthError(400, 'Email and password required');
        await register(email, password);
        res.status(201).json({ message: 'User created' });
    }catch(e){
       next(e);
    }
}));

authRouter.post('/login', asyncHandler( async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new AuthError(400, 'Email and password required');
        const token = await login(email, password);
        res.status(200).json({ token });
    }catch(e){
        next(e);
    }
}));

export default authRouter;