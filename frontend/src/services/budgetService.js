const API_URL = "http://localhost:8070/api/budget";

const budgetService = {
  // ✅ Set budget in backend (POST request)
  setBudget: async (budget) => {
    try {
      if (!budget || isNaN(budget) || budget <= 0) {
        throw new Error("Invalid budget amount! Must be a positive number.");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: budget }), // 🔹 Fix: Correct payload key
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to set budget: ${errorMessage}`);
      }

      return await response.json(); // ✅ Return success response
    } catch (error) {
      console.error("❌ Error setting budget:", error);
      return { success: false, message: error.message };
    }
  },

  // ✅ Fetch AI-generated weekly meal plan (GET request)
  getWeeklyMealPlan: async () => {
    try {
      const response = await fetch(`${API_URL}/weekly-meal-plan`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch meal plan: ${errorMessage}`);
      }

      const data = await response.json();
      if (!data.weeklyMealPlan) {
        throw new Error("Meal plan not found");
      }

      return data;
    } catch (error) {
      console.error("❌ Error fetching meal plan:", error);
      return { success: false, message: error.message };
    }
  },
};

export default budgetService;
