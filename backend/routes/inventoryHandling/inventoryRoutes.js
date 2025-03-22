const express = require("express");
const router = express.Router();
const Inventory = require("../../models/inventoryHandling/inventoryModel.js"); // Import Inventory Model

// ➤ Add Inventory Item
router.post("/add", async (req, res) => {
    try {
        const { name, quantity, category, quantityType, threshold, expiryDate } = req.body;

        const newItem = new Inventory({
            name,
            quantity,
            category,
            quantityType,
            threshold,
            expiryDate,
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully", newItem });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding inventory item" });
    }
});

// ➤ Get All Inventory Items
router.get("/", async (req, res) => {
    try {
        const items = await Inventory.find();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving inventory" });
    }
});

// ➤ Update Inventory Item
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedItem = await Inventory.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Item updated successfully", updatedItem });

    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ error: "Error deleting inventory item" });
    }
});

module.exports = router;
