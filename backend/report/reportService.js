const { getMealSummary } = require("./mealService");
const { getShoppingListSummary } = require("./shoppingListService");
const Budget = require("../models/smartShopping/Budget"); // Adjust if inside subfolder

async function generateDatabaseReport() {
  const latestBudget = await Budget.findOne().sort({ createdAt: -1 });
  const { mealsSummary, mealsList } = await getMealSummary();
  const shoppingLists = await getShoppingListSummary();

  return {
    budget: latestBudget,
    mealsSummary,
    mealsList,
    shoppingLists,
  };
}

module.exports = { generateDatabaseReport };
