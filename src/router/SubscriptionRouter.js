import { Router } from 'express';
import { asyncHandler } from '../AsyncHandler.js';
import { subscribe, unsubscribe, getSubscriptions } from '../controllers/SubscriptionController.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const subscriptions = await getSubscriptions(userID);
    res.status(200).json(subscriptions);
}));

subscriptionRouter.post('/:id', asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const targetID = req.params.id;
    await subscribe(userID, targetID);
    res.status(201).json();
}));

subscriptionRouter.delete('/:id', asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const targetID = req.params.id;
    await unsubscribe(userID, targetID);
    res.status(204).end();
}));

export default subscriptionRouter;