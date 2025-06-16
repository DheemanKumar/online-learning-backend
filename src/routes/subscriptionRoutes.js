const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const auth = require("../middleware/auth");

// GET /api/subscriptions/plans
router.get("/plans", subscriptionController.getPlans);

// POST /api/subscriptions/purchase
router.post("/purchase", auth, subscriptionController.purchaseSubscription);

module.exports = router;
