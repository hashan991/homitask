const express = require("express");
const router = express.Router();
const Inventory = require("../../models/inventoryHandling/inventoryModel");
const RemoveInventory = require("../../models/inventoryHandling/removeInventoryModel");

router.get("/", async (req, res) => {
  try {
    const allItems = await Inventory.find();
    const removedItems = await RemoveInventory.find();

    const now = new Date();
    const next7 = new Date();
    next7.setDate(now.getDate() + 7);

    const lowStockItems = allItems.filter(
      (item) => item.quantity <= item.threshold
    );
    const expiringSoon = allItems.filter(
      (item) => new Date(item.expiryDate) <= next7
    );

    const categories = [...new Set(allItems.map((i) => i.category))];

    // Summary by category
    const categorySummary = categories.map((cat) => {
      const catItems = allItems.filter((i) => i.category === cat);
      return {
        category: cat,
        inStock: catItems.length,
        lowStock: catItems.filter((i) => i.quantity <= i.threshold).length,
        expiring: catItems.filter((i) => new Date(i.expiryDate) <= next7)
          .length,
      };
    });

    // Total quantity in stock
    const totalQuantity = allItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Most frequently removed item
    const nameCountMap = {};
    removedItems.forEach((item) => {
      nameCountMap[item.name] = (nameCountMap[item.name] || 0) + item.quantity;
    });

    const mostUsed = Object.entries(nameCountMap).sort(
      (a, b) => b[1] - a[1]
    )[0]; // ['Rice', 12]

    // Expiry rate (% of all items expiring soon)
    const expiryRate =
      allItems.length > 0
        ? ((expiringSoon.length / allItems.length) * 100).toFixed(2)
        : "0.00";

    // Average quantity by category
    const avgByCategory = categories.map((cat) => {
      const catItems = allItems.filter((i) => i.category === cat);
      const totalQty = catItems.reduce((sum, i) => sum + i.quantity, 0);
      return {
        category: cat,
        averageQuantity: catItems.length
          ? (totalQty / catItems.length).toFixed(2)
          : "0",
      };
    });

    // Low stock rate by category
    const lowRateByCat = categories.map((cat) => {
      const catItems = allItems.filter((i) => i.category === cat);
      const lowCount = catItems.filter((i) => i.quantity <= i.threshold).length;
      return {
        category: cat,
        lowStockRate: catItems.length
          ? ((lowCount / catItems.length) * 100).toFixed(2) + "%"
          : "0%",
      };
    });

    res.json({
      totalItems: allItems.length,
      totalQuantity,
      totalRemovedItems: removedItems.length,
      mostUsedItem: mostUsed
        ? { name: mostUsed[0], quantity: mostUsed[1] }
        : null,
      expiryRate,
      avgByCategory,
      lowRateByCat,
      lowStockCount: lowStockItems.length,
      expiringSoonCount: expiringSoon.length,
      lowStockItems,
      expiringSoon,
      removedItems,
      categorySummary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating inventory report" });
  }
});

module.exports = router;
