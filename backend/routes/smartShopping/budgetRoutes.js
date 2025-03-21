const express = require("express");
const {
  setBudget,
  getMealPlan,
  getWeeklyMealPlan,
} = require("../../controllers/budgetController");

const router = express.Router();

// @route POST /api/budget - Set user budget
router.post("/", setBudget);

// @route GET /api/budget/meal-plan - Get AI-suggested meal plan within budget (Daily)
router.get("/meal-plan", getMealPlan);

// @route GET /api/budget/weekly-meal-plan - Get AI-suggested meal plan for the week
router.get("/weekly-meal-plan", getWeeklyMealPlan);

module.exports = router;
