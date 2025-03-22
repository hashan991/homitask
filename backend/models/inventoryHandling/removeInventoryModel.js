const mongoose = require("mongoose");

const removeInventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    quantityType: { type: String, required: true },
    threshold: { type: Number, required: true },
    expiryDate: { type: Date, required: true }
}, { timestamps: true });

const RemoveInventory = mongoose.model("RemoveInventory", removeInventorySchema);

module.exports = RemoveInventory;
