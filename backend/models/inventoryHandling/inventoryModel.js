const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    quantityType: { type: String, required: true }, // Changed to camelCase
    threshold: { type: Number, required: true }, // Low stock threshold
    expiryDate: { type: Date, required: true } // Added expiry date field
}, { timestamps: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
