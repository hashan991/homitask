const Meal = require("../models/smartShopping/Meal");

// @desc Get all meals
// @route GET /api/meals
const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meals", error });
  }
};

// @desc Add a new meal
// @route POST /api/meals
const addMeal = async (req, res) => {
  try {
    const { name, price, description, category, calories } = req.body;
    const newMeal = new Meal({ name, price, description, category, calories });

    await newMeal.save();
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(400).json({ message: "Error adding meal", error });
  }
};

// @desc Update a meal
// @route PUT /api/meals/:id
const updateMeal = async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedMeal);
  } catch (error) {
    res.status(400).json({ message: "Error updating meal", error });
  }
};

// @desc Delete a meal
// @route DELETE /api/meals/:id
const deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal", error });
  }
};

module.exports = { getMeals, addMeal, updateMeal, deleteMeal };
