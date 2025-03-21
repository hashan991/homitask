import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Divider,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import BudgetInput from "./BudgetInput";
import MealCard from "./MealCard";
import AnalyzingBudget from "./AnalyzingBudgetUi";


const BudgetPlanner = () => {
  const [budget, setBudget] = useState(50);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Meals & Snacks After Setting Budget
  const fetchMealsByBudget = async () => {
    setLoading(true); // ✅ Start loading
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
    setLoading(false); // ✅ Stop loading when done
  };

  // ✅ Function to Set Budget & Fetch Meals
  const handleBudgetSubmit = async (newBudget) => {
    setBudget(newBudget);
    setError("");
    setLoading(true); // ✅ Start loading when budget is submitted

    try {
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
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{
            mb: 3,
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            boxShadow: "0px 5px 15px rgba(106, 17, 203, 0.4)",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(to right, #2575fc, #6a11cb)",
            },
          }}
        >
          🍽️ Budget Meal Planner
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <BudgetInput onBudgetSubmit={handleBudgetSubmit} />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {/* ✅ Show "Analyzing Budget..." while Loading */}
        {loading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 3, // ✅ Space below Budget Input
              ml: -3, // ✅ Space to the right
            }}
          >
            <AnalyzingBudget />
          </Box>
        ) : (
          <>
            {/* ✅ Glassmorphism Budget Summary (Moved Below Analyzing Message) */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Paper
                elevation={4}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backdropFilter: "blur(10px)",
                  background: "rgba(255, 255, 255, 0.2)",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  mt: 3, // Add margin top
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  💰 Total Cost: ${totalCost}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "green" }}
                >
                  🏦 Remaining Budget: ${remainingBudget}
                </Typography>
              </Paper>
            </motion.div>

            {/* ✅ Meals for Each Day */}
            {weeklyMealPlan.length === 0 ? (
              <Typography
                variant="body1"
                color="gray"
                textAlign="center"
                mt={4}
              >
                No meals available. Please enter a budget.
              </Typography>
            ) : (
              weeklyMealPlan.map((dayPlan, index) => (
                <Box key={index} sx={{ mt: 4 }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    📅 {dayPlan.day}
                  </Typography>
                  <Grid container spacing={2}>
                    {dayPlan.meals.length > 0 ? (
                      dayPlan.meals.map((meal, mealIndex) => (
                        <Grid item xs={12} sm={6} md={4} key={mealIndex}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <MealCard meal={meal} showActions={false} />
                          </motion.div>
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
                  🍎 Snacks
                </Typography>
                <Grid container spacing={2}>
                  {snacks.map((snack, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MealCard meal={snack} showActions={false} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default BudgetPlanner;
