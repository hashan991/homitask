const express = require("express");
const router = express.Router();
const Meal = require("../../models/smartShopping/Meal");
const generateShoppingList = require("../../utils/shoppingListGenerator");
const ShoppingList = require("../../models/smartShopping/ShoppingList");

// @desc Generate shopping list from meals
// @route POST /api/shopping-list
router.post("/", async (req, res) => {
  try {
    const { mealIds } = req.body;
    const meals = await Meal.find({ _id: { $in: mealIds } });
    const shoppingList = generateShoppingList(meals);

    res.status(200).json(shoppingList);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to generate shopping list", error: err });
  }
});

// @desc Save shopping list to DB
// @route POST /api/shopping-list/save
router.post("/save", async (req, res) => {
  try {
    const { name, date, mealIds, items } = req.body;

    if (!name || !date || !mealIds || !items) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const savedList = await new ShoppingList({
      name,
      date,
      mealIds,
      items,
    }).save();

    res.status(201).json(savedList);
  } catch (err) {
    console.error("❌ Error saving shopping list:", err);
    res.status(500).json({ message: "Error saving shopping list", error: err });
  }
});

// @desc Get all saved shopping lists
// @route GET /api/shopping-list/all
router.get("/all", async (req, res) => {
  try {
    const lists = await ShoppingList.find().sort({ createdAt: -1 });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved lists", error });
  }
});

// @desc Update a shopping list
// @route PUT /api/shopping-list/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, date, mealIds, items } = req.body;

    const updatedList = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      { name, date, mealIds, items },
      { new: true }
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json(updatedList);
  } catch (error) {
    res.status(500).json({ message: "Error updating list", error });
  }
});

// @desc Delete a shopping list
// @route DELETE /api/shopping-list/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ShoppingList.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting list", error });
  }
});

module.exports = router;
