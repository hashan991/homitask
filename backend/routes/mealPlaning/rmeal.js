const router = require("express").Router();
const MealPlan = require("../../models/mealPlaning/meal.js"); // Ensure correct path to model

// Create a new meal plan entry
router.route("/add").post((req, res) => {
  const { day, mealType, mealName, ingredients, recipe, calories, availabilityStatus } = req.body;

  const newMealPlan = new MealPlan({
    day,
    mealType,
    mealName,
    ingredients,
    recipe,
    calories,
    availabilityStatus,
  });

  newMealPlan
    .save()
    .then(() => res.json("Meal Plan Added Successfully!"))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error adding meal plan" });
    });
});

// Get all meal plans
router.route("/").get((req, res) => {
  MealPlan.find()
    .then((MealPlans) =>{ 
      res.json(MealPlans)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error fetching meal plans" });
    });
});

// Update a meal plan by ID
router.route("/update/:id").put(async (req, res) => {
  const id = req.params.id;
  const { day, mealType, mealName, ingredients, recipe, calories, availabilityStatus } = req.body;

  try {
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      id,
      { day, mealType, mealName, ingredients, recipe, calories, availabilityStatus },
      { new: true }
    );

    if (!updatedMealPlan) {
      return res.status(404).json({ message: "Meal Plan not found" });
    }

    res.json({ message: "Meal Plan updated successfully", updatedMealPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating meal plan" });
  }
});

// Delete a meal plan by ID
router.route("/delete/:id").delete((req, res) => {
  const id = req.params.id;
  console.log(`Attempting to delete supplier with ID: ${id}`); // Log the ID

  MealPlan.findByIdAndDelete(id)
    .then((deletedMealPlan) => {
      if (!deletedMealPlan) {
        return res.status(404).json({ message: "Meal Plan not found" });
      }
      res.json({ message: "Meal Plan deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error deleting meal plan" });
    });
});

module.exports = router;
