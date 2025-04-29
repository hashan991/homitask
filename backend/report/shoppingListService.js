const ShoppingList = require("../models/smartShopping/ShoppingList"); // Adjust if inside subfolder

async function getShoppingListSummary() {
  const shoppingLists = await ShoppingList.find().populate("mealIds");

  const formattedShoppingLists = shoppingLists.map((list) => {
    const linkedMeals = list.mealIds.map((meal) => meal.name);
    const uniqueIngredients = [...new Set(list.items.map((item) => item.name))];

    return {
      name: list.name,
      date: list.date,
      linkedMeals,
      items: list.items,
      totalItems: list.items.length,
      uniqueIngredients,
    };
  });

  return formattedShoppingLists;
}

module.exports = { getShoppingListSummary };
