const { Subscription, User } = require("../models");

// Hardcoded plans for demo
const plans = [
  {
    id: 1,
    name: "Plus",
    price: 999,
    duration: "monthly",
    features: [
      "Access to all Plus courses",
      "Live classes",
      "Doubt clearing sessions",
      "Test series"
    ]
  },
  {
    id: 2,
    name: "Iconic",
    price: 2999,
    duration: "monthly",
    features: [
      "Everything in Plus",
      "Top educator courses",
      "Personal mentorship",
      "Priority doubt solving"
    ]
  }
];

// GET /api/subscriptions/plans
exports.getPlans = (req, res) => {
  res.json({ success: true, plans });
};

// POST /api/subscriptions/purchase
exports.purchaseSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId } = req.body;
    const plan = plans.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ success: false, message: "Invalid plan" });
    // Upsert subscription
    const [sub, created] = await Subscription.findOrCreate({
      where: { userId },
      defaults: {
        plan: plan.name,
        features: JSON.stringify(plan.features),
        activeUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
      }
    });
    if (!created) {
      // Update existing
      sub.plan = plan.name;
      sub.features = JSON.stringify(plan.features);
      sub.activeUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await sub.save();
    }
    res.json({ success: true, message: "Subscription purchased", subscription: sub });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
