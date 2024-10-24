import { Router } from 'express';
import { asyncHandler } from './AsyncHandler.js';
import { subscribe, unsubscribe } from '../controllers/SubscriptionController.js';

const subscriptionRouter = Router();

subscriptionRouter.post('/:id', asyncHandler( async (req, res, next) => {
    try {
        const userID = req.user.dataValues.id;
        const targetID = req.params.id;
        await subscribe(userID, targetID);
        res.status(201).json();
    }catch(e){
        next(e);
    }
}));

subscriptionRouter.delete('/:id', asyncHandler( async (req, res, next) => {
    try {
        const userID = req.user.dataValues.id;
        const targetID = req.params.id;
        await unsubscribe(userID, targetID);
        res.status(204).end();
    }catch(e){
        next(e);
    }
}));

export default subscriptionRouter;