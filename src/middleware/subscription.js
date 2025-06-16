// Subscription check middleware
module.exports = (SubscriptionModel) => async (req, res, next) => {
  const userId = req.user.id;
  const sub = await SubscriptionModel.findOne({ where: { userId } });
  if (!sub || new Date(sub.activeUntil) < new Date()) {
    return res.status(403).json({ success: false, message: "No active subscription" });
  }
  next();
};
