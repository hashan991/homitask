import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import MealForm from "./MealForm";
import MealCard from "./MealCard";

const MealPlanner = () => {
  const [meals, setMeals] = useState([]);

  // 🔹 Fetch meals from the database when the page loads
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:8070/api/meals"); // Adjust your API URL
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []); // Runs only on mount

  // 🔹 Add a new meal (POST request to backend)
  const handleMealSubmit = async (newMeal) => {
    try {
      const response = await axios.post(
        "http://localhost:8070/api/meals",
        newMeal
      ); // API endpoint for saving meal
      setMeals([...meals, response.data]); // Update state with the newly added meal
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meal Planner</h1>
      <MealForm onMealSubmit={handleMealSubmit} />
      <h2 className="text-xl font-semibold mt-4">Your Meals</h2>
      <div className="grid gap-4 mt-2">
        {meals.length === 0 ? (
          <p>No meals added yet.</p>
        ) : (
          meals.map((meal) => <MealCard key={meal._id} meal={meal} />) // Ensure meals have an `_id`
        )}
      </div>
    </div>
  );
};

export default MealPlanner;
