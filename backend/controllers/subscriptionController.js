const subscriptionModel = require("../models/subscriptionModel");

function createSubscription(req, res) {

    try {

        const userId = req.user.userId;

        const { name, amount, billing_cycle, next_payment_date } = req.body;

        subscriptionModel.createSubscription(
            userId,
            name,
            amount,
            billing_cycle,
            next_payment_date
        );

        res.json({ message: "Subscription added" });

    } catch (error) {
        res.status(500).json({ error: "Failed to add subscription" });
    }
}

function getSubscriptions(req, res) {

    try {

        const userId = req.user.userId;

        const subscriptions = subscriptionModel.getSubscriptionsByUser(userId);

        res.json(subscriptions);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
}

function deleteSubscription(req, res) {

    try {

        const id = req.params.id;

        subscriptionModel.deleteSubscription(id);

        res.json({ message: "Subscription removed" });

    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
}

module.exports = {
    createSubscription,
    getSubscriptions,
    deleteSubscription
};