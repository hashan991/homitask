import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Box,
} from "@mui/material";
import BudgetInput from "./BudgetInput";
import MealCard from "./MealCard";

const BudgetPlanner = () => {
  const [budget, setBudget] = useState(50);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState([]);
  const [snacks, setSnacks] = useState([]); // ✅ Snacks State
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
      console.log("🔹 API Response:", data);

      if (!data.weeklyMealPlan) {
        throw new Error("Meal plan not found");
      }

      setWeeklyMealPlan(data.weeklyMealPlan);
      setSnacks(data.snacks || []);
      setTotalCost(data.totalCost);
      setRemainingBudget(data.remainingBudget);
      setError("");
    } catch (error) {
      console.error("❌ Error fetching meal plan:", error);
      setError("Error fetching meal plan. Please try again.");
    }
  };

  // ✅ Function to Set Budget & Fetch Meals
  const handleBudgetSubmit = async (newBudget) => {
    setBudget(newBudget);
    setError("");

    try {
      // ✅ Update budget in backend
      const budgetResponse = await fetch("http://localhost:8070/api/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newBudget }),
      });

      if (!budgetResponse.ok) {
        throw new Error("Failed to set budget.");
      }

      console.log("✅ Budget updated successfully!");
      await fetchMealsByBudget();
    } catch (error) {
      console.error("❌ Error setting budget:", error);
      setError("Failed to set budget. Please try again.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        Budget Meal Planner
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <BudgetInput onBudgetSubmit={handleBudgetSubmit} />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {/* ✅ Budget Summary */}
      <Card
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          boxShadow: 2,
          mb: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Total Cost: ${totalCost}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "green" }}>
            Remaining Budget: ${remainingBudget}
          </Typography>
        </CardContent>
      </Card>

      {/* ✅ Meals for Each Day */}
      {weeklyMealPlan.length === 0 ? (
        <Typography variant="body1" color="gray" textAlign="center">
          No meals available. Please enter a budget.
        </Typography>
      ) : (
        weeklyMealPlan.map((dayPlan, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              {dayPlan.day}
            </Typography>
            <Grid container spacing={2}>
              {dayPlan.meals.length > 0 ? (
                dayPlan.meals.map((meal, mealIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={mealIndex}>
                    <MealCard meal={meal} />
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" color="gray">
                  No meals for this day.
                </Typography>
              )}
            </Grid>
          </Box>
        ))
      )}

      {/* ✅ Snacks Section */}
      {snacks.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Snacks
          </Typography>
          <Grid container spacing={2}>
            {snacks.map((snack, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MealCard meal={snack} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default BudgetPlanner;
