const express = require("express");
const router = express.Router();
const RemoveInventory = require("../../models/inventoryHandling/removeInventoryModel.js"); // Import RemoveInventory Model

// ➤ Add Removed Inventory Item
router.post("/add", async (req, res) => {
    try {
        const { name, quantity, category, quantityType, threshold, expiryDate } = req.body;

        const newRemovedItem = new RemoveInventory({
            name,
            quantity,
            category,
            quantityType,
            threshold,
            expiryDate,
        });

        await newRemovedItem.save();
        res.status(201).json({ message: "Removed item added successfully", newRemovedItem });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding removed inventory item" });
    }
});

// ➤ Get All Removed Inventory Items
router.get("/", async (req, res) => {
    try {
        const removedItems = await RemoveInventory.find();
        res.json(removedItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving removed inventory items" });
    }
});

// ➤ Update Removed Inventory Item
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedRemovedItem = await RemoveInventory.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedRemovedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Removed item updated successfully", updatedRemovedItem });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating removed inventory item" });
    }
});

// ➤ Delete Removed Inventory Item
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRemovedItem = await RemoveInventory.findByIdAndDelete(id);

        if (!deletedRemovedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ message: "Removed item deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting removed inventory item" });
    }
});

module.exports = router;
