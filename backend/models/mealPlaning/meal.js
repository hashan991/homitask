const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MealPlanSchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  mealType: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Tea-Time", "Dinner"],
  },
  mealName: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String], // Storing ingredients as an array of strings
    required: true,
  },
  recipe: {
    type: String, // Storing full recipe instructions as a string
    required: true,
  },
  calories: {
    type: Number, // Calories per serving
    required: true,
  },
  availabilityStatus: {
    type: Boolean, // True if ingredients are available, False if not
    default: true,
  },
});

// Ensure the model name follows best practices
const MealPlan = mongoose.model("MealPlan2", MealPlanSchema);

module.exports = MealPlan;
