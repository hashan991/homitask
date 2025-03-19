const express = require("express");
const router = express.Router();
const Inventory = require("../../models/inventoryHandling/inventoryModel.js"); // Import Inventory Model

// ➤ Add Inventory Item
router.post("/add", async (req, res) => {
    try {
        const { name, quantity, category, quantityType, threshold } = req.body;

        // Input validation (Ensure all fields are provided)
        if (!name || !quantity || !category || !quantityType || !threshold) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Input validation (Ensure quantity and threshold are positive numbers)
        if (quantity < 0 || threshold < 0) {
            return res.status(400).json({ error: "Quantity and threshold must be positive numbers" });
        }

        const newItem = new Inventory({
            name,
            quantity,
            category,
            quantityType, // Changed to camelCase to match model
            threshold,
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully", newItem });

    } catch (error) {
        console.error("Error adding inventory item:", error);
        res.status(500).json({ error: "Error adding inventory item" });
    }
});

// ➤ Get All Inventory Items
router.get("/", async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);
    } catch (error) {
        console.error("Error retrieving inventory:", error);
        res.status(500).json({ error: "Error retrieving inventory" });
    }
});

// ➤ Update Inventory Item
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Validation before updating
        if (!updatedData.name || !updatedData.quantity || !updatedData.category || !updatedData.quantityType || !updatedData.threshold) {
            return res.status(400).json({ error: "All fields are required for update" });
        }

        // Input validation (Ensure quantity and threshold are positive numbers)
        if (updatedData.quantity < 0 || updatedData.threshold < 0) {
            return res.status(400).json({ error: "Quantity and threshold must be positive numbers" });
        }

        const updatedItem = await Inventory.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item updated successfully", updatedItem });

    } catch (error) {
        console.error("Error updating inventory item:", error);
        res.status(500).json({ error: "Error updating inventory item" });
    }
});

// ➤ Delete Inventory Item
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await Inventory.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item deleted successfully" });

    } catch (error) {
        console.error("Error deleting inventory item:", error);
        res.status(500).json({ error: "Error deleting inventory item" });
    }
});

module.exports = router;
