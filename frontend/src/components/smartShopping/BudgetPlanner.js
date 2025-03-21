import React, { useState } from "react";
import BudgetInput from "./BudgetInput";
import MealCard from "./MealCard";

const BudgetPlanner = () => {
  const [budget, setBudget] = useState(50);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState([]);
  const [snacks, setSnacks] = useState([]); // ✅ Added state for Snacks
  const [totalCost, setTotalCost] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [error, setError] = useState("");

  // ✅ Fetch Meals & Snacks After Setting Budget
  const fetchMealsByBudget = async () => {
    try {
      const response = await fetch(
        "http://localhost:8070/api/budget/weekly-meal-plan",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch meal plan");
      }

      const data = await response.json();
      console.log("🔹 API Response:", data); // ✅ Debugging

      if (!data.weeklyMealPlan) {
        throw new Error("Meal plan not found");
      }

      setWeeklyMealPlan(data.weeklyMealPlan);
      setSnacks(data.snacks || []); // ✅ Ensure snacks are also set
      setTotalCost(data.totalCost);
      setRemainingBudget(data.remainingBudget);
      setError(""); // ✅ Clear previous errors
    } catch (error) {
      console.error("❌ Error fetching meal plan:", error);
      setError("Error fetching meal plan. Please try again.");
    }
  };

  // ✅ Function to Set Budget & Fetch Meals
  const handleBudgetSubmit = async (newBudget) => {
    setBudget(newBudget);
    setError(""); // ✅ Clear previous errors

    try {
      // ✅ Step 1: Update budget in backend
      const budgetResponse = await fetch("http://localhost:8070/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newBudget }), // ✅ Ensure correct key name
      });

      if (!budgetResponse.ok) {
        throw new Error("Failed to set budget.");
      }

      console.log("✅ Budget updated successfully!");

      // ✅ Step 2: Fetch updated meal plan from backend
      await fetchMealsByBudget();
    } catch (error) {
      console.error("❌ Error setting budget:", error);
      setError("Failed to set budget. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Budget Meal Planner
      </h1>

      <BudgetInput onBudgetSubmit={handleBudgetSubmit} />

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      <h2 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "16px" }}>
        Suggested Meals
      </h2>

      {/* ✅ Display total cost & remaining budget */}
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          background: "#f8f8f8",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}>
          Total Cost: ${totalCost}
        </p>
        <p style={{ fontSize: "16px", fontWeight: "bold", color: "#4CAF50" }}>
          Remaining Budget: ${remainingBudget}
        </p>
      </div>

      {weeklyMealPlan.length === 0 ? (
        <p style={{ fontSize: "14px", color: "gray" }}>
          No meals available. Please enter a budget.
        </p>
      ) : (
        weeklyMealPlan.map((dayPlan, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>
              {dayPlan.day}
            </h3>
            {dayPlan.meals.length > 0 ? (
              dayPlan.meals.map((meal, mealIndex) => (
                <MealCard key={mealIndex} meal={meal} />
              ))
            ) : (
              <p style={{ fontSize: "14px", color: "gray" }}>
                No meals for this day.
              </p>
            )}
          </div>
        ))
      )}

      {/* ✅ Render Snacks */}
      {snacks.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Snacks</h2>
          <div style={{ display: "grid", gap: "10px" }}>
            {snacks.map((snack, index) => (
              <MealCard key={index} meal={snack} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
