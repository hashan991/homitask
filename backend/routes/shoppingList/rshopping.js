const express = require("express");
const router = express.Router();
const Shopping = require("../../models/shoppingList/shopping.js"); // Ensure correct path

// ✅ Add a new shopping list with multiple items
router.post("/add", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Items array is required and cannot be empty." });
    }

    const newShoppingList = new Shopping({ items });
    await newShoppingList.save();

    res.status(201).json({ success: true, message: "Shopping list added successfully.", shoppingList: newShoppingList });

  } catch (error) {
    console.error("Error adding shopping list:", error);
    res.status(500).json({ success: false, message: "Error adding shopping list.", error: error.message });
  }
});

// ✅ Get all shopping lists
router.get("/", async (req, res) => {
  try {
    const shoppingLists = await Shopping.find();
    res.json({ success: true, shoppingLists });
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    res.status(500).json({ success: false, message: "Error fetching shopping lists.", error: error.message });
  }
});

// ✅ Get a single shopping list by ID
router.get("/:id", async (req, res) => {
  try {
    const shoppingList = await Shopping.findById(req.params.id);

    if (!shoppingList) {
      return res.status(404).json({ success: false, message: "Shopping list not found." });
    }

    res.json({ success: true, shoppingList });

  } catch (error) {
    console.error("Error fetching shopping list:", error);
    res.status(500).json({ success: false, message: "Error fetching shopping list.", error: error.message });
  }
});

// ✅ Delete a specific item from a shopping list
router.delete("/delete/:listId/:itemId", async (req, res) => {
  try {
    const { listId, itemId } = req.params;

    const updatedShoppingList = await Shopping.findByIdAndUpdate(
      listId,
      { $pull: { items: { _id: itemId } } }, // Remove specific item
      { new: true }
    );

    if (!updatedShoppingList) {
      return res.status(404).json({ success: false, message: "Shopping list or item not found." });
    }

    res.json({ success: true, message: "Item deleted successfully.", updatedShoppingList });

  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Error deleting item.", error: error.message });
  }
});

// ✅ Update a specific item in a shopping list
router.put("/update/:listId/:itemId", async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const updatedItem = req.body; // New item data

    if (!updatedItem || Object.keys(updatedItem).length === 0) {
      return res.status(400).json({ success: false, message: "Updated item data is required." });
    }

    const updatedShoppingList = await Shopping.findOneAndUpdate(
      { _id: listId, "items._id": itemId }, // Find list & item
      { $set: { "items.$": updatedItem } }, // Replace the item
      { new: true, runValidators: true } // Ensure validation runs
    );

    if (!updatedShoppingList) {
      return res.status(404).json({ success: false, message: "Shopping list or item not found." });
    }

    res.json({ success: true, message: "Item updated successfully.", updatedShoppingList });

  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ success: false, message: "Error updating item.", error: error.message });
  }
});

// ✅ Delete an entire shopping list
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedShoppingList = await Shopping.findByIdAndDelete(req.params.id);

    if (!deletedShoppingList) {
      return res.status(404).json({ success: false, message: "Shopping list not found." });
    }

    res.json({ success: true, message: "Shopping list deleted successfully." });

  } catch (error) {
    console.error("Error deleting shopping list:", error);
    res.status(500).json({ success: false, message: "Error deleting shopping list.", error: error.message });
  }
});

module.exports = router;
