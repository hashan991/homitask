const API_URL = "http://localhost:8070/api/meals";

const mealService = {
  // Fetch all meals
  getMeals: async () => {
    try {
      const response = await fetch(API_URL);
      return await response.json();
    } catch (error) {
      console.error("Error fetching meals:", error);
      return [];
    }
  },

  // Fetch a single meal by ID
  getMealById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching meal:", error);
      return null;
    }
  },

  // Create a new meal
  createMeal: async (mealData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating meal:", error);
      return null;
    }
  },

  // Update a meal
  updateMeal: async (id, mealData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating meal:", error);
      return null;
    }
  },

  // Delete a meal
  deleteMeal: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      return await response.json();
    } catch (error) {
      console.error("Error deleting meal:", error);
      return null;
    }
  },
};

export default mealService;
