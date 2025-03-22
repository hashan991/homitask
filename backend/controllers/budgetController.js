const Meal = require("../models/smartShopping/Meal");
const Budget = require("../models/smartShopping/Budget");
const {
  generateMealPlan,
  generateWeeklyMealPlan,
} = require("../utils/aiLogic");

// @desc Set budget for the week
// @route POST /api/budget
const setBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate budget input
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Budget must be a positive number." });
    }

    let budget = await Budget.findOne();

    if (budget) {
      budget.amount = amount;
    } else {
      budget = new Budget({ amount });
    }

    await budget.save(); // Save budget
    res.status(200).json({ message: "Budget set successfully!", budget });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting budget", error: error.message });
  }
};

// @desc Get AI-suggested meal plan for the day based on budget
// @route GET /api/budget/meal-plan
const getMealPlan = async (req, res) => {
  try {
    const budget = await Budget.findOne().lean();
    if (!budget) {
      return res.status(400).json({ message: "Set a budget first!" });
    }

    // Use AI logic to generate the daily meal plan
    const mealPlanData = await generateMealPlan(budget.amount);

    res.status(200).json(mealPlanData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating meal plan", error: error.message });
  }
};

// @desc Get AI-suggested weekly meal plan based on budget
// @route GET /api/budget/weekly-meal-plan
const getWeeklyMealPlan = async (req, res) => {
  try {
    const { calorieGoal } = req.query; // User can pass a custom calorie goal
    const budget = await Budget.findOne();

    if (!budget) {
      return res.status(400).json({ message: "Set a budget first!" });
    }

    const targetCalories = calorieGoal ? parseInt(calorieGoal) : 2000;
    const weeklyBudget = budget.amount;

    // Use AI logic to generate the weekly meal plan
    const mealPlanData = await generateWeeklyMealPlan(
      weeklyBudget,
      targetCalories
    );

    res.status(200).json(mealPlanData);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating weekly meal plan",
        error: error.message,
      });
  }
};

module.exports = { setBudget, getMealPlan, getWeeklyMealPlan };
