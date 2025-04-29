const Meal = require("../models/smartShopping/Meal"); // Adjust if inside subfolder

async function getMealSummary() {
  const meals = await Meal.find();

  const totalMeals = meals.length;
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalCost = meals.reduce((sum, meal) => sum + meal.price, 0);

  const categories = meals.reduce((acc, meal) => {
    acc[meal.category] = (acc[meal.category] || 0) + 1;
    return acc;
  }, {});

  return {
    mealsSummary: {
      totalMeals,
      totalCalories,
      totalCost,
      categories,
    },
    mealsList: meals,
  };
}

module.exports = { getMealSummary };
