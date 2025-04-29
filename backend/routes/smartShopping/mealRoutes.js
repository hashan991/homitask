const express = require("express");
const {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
} = require("../../controllers/mealController");

const router = express.Router();

// @route GET /api/meals - Get all meals
router.get("/", getMeals);

// @route POST /api/meals - Add a new meal
router.post("/", addMeal);

// @route PUT /api/meals/:id - Update a meal
router.put("/:id", updateMeal);

// @route DELETE /api/meals/:id - Delete a meal
router.delete("/:id", deleteMeal);

module.exports = router;
