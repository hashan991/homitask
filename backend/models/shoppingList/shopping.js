const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ShoppingItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: { 
    type: Number,
    required: true,
    min: 1,
  },
  quantityType: { 
    type: String,
    required: true,
    enum: ["Unit", "Kg", "g", "L", "ml", "m"],
  },
  category: { 
    type: String,
    required: true,
    enum: ["Kitchen", "Garden", "Garage", "Cleaning"],
  },
  priority: { 
    type: String,
    required: true,
    enum: ["High", "Medium", "Low"],
  },
  estimatedPrice: { 
    type: Number,
    required: true,
    min: 0,
    default: 0.0, // Supports decimal values
  },
});

const ShoppingSchema = new Schema({
  items: [ShoppingItemSchema], // Array of shopping items
}, { timestamps: true });

const Shopping = mongoose.model("Shopping", ShoppingSchema);

module.exports = Shopping;
