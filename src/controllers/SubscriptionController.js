import { Subscription } from '../models/Subscription.js';
import { SubscriptionError } from '../classes/SubscriptionError.js';
import { User } from '../models/User.js';

export const subscribe = async (userID, targetID) => {
  try {
    const sub = await Subscription.findOne({ where: { ownerID: userID, targetID: targetID } });
    if (sub) throw new SubscriptionError(400, 'Already subscribed');
    await Subscription.create({ ownerID: userID, targetID });
  } catch (error) {
    throw new SubscriptionError(500, error.message);
  }
};

export const unsubscribe = async (userID, targetID) => {
  try {
    await Subscription.destroy({ where: { ownerID: userID, targetID: targetID } });
  } catch (error) {
    throw new SubscriptionError(500, error.message);
  }
};

export const getSubscriptions = async (userID) => {
  try {
    const subscriptions = await Subscription.findAll({ 
      where: { ownerID: userID },
      include: { 
        model: User, as: 'friend',
        attributes: ['id', 'firstname', 'lastname'],
      },
    });
    return subscriptions;
  } catch (error) {
    throw new SubscriptionError(500, error.message);
  }
};



