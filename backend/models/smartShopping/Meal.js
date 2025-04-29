const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    calories: { type: Number, required: true },

    ingredients: [
      {
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 0 },
        unit: { type: String, required: true, trim: true }, // e.g., "g", "pcs"
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);
