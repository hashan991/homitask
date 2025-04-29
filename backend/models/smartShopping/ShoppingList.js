const mongoose = require("mongoose");

const ShoppingListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    mealIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingList", ShoppingListSchema);
