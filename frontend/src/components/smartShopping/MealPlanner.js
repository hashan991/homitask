import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import MealForm from "./MealForm";
import MealCard from "./MealCard";
import AddIcon from "@mui/icons-material/Add";

const MealPlanner = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch meals from the database when the page loads
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("http://localhost:8070/api/meals");
        setMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // 🔹 Add a new meal (POST request to backend)
  const handleMealSubmit = async (newMeal) => {
    try {
      const response = await axios.post(
        "http://localhost:8070/api/meals",
        newMeal
      );
      setMeals([...meals, response.data]);
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "1100px",
        mx: "auto",
        minHeight: "100vh",
        backdropFilter: "blur(15px)",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "20px",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      {/* 🌟 Title Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        sx={{
          color: "#ffffff",
          textShadow: "0px 2px 5px rgba(0,0,0,0.4)",
          mb: 3,
        }}
      >
        🍽️ Meal Planner
      </Typography>

      

      {/* 📜 Meal Form */}
      <MealForm onMealSubmit={handleMealSubmit} />

      {/* 🍱 Meals List */}
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="left"
        sx={{
          color: "#ffffff",
          mt: 4,
          mb: 2,
        }}
      >
        Your Meals
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : meals.length === 0 ? (
        <Typography variant="body1" sx={{ color: "gray", textAlign: "center" }}>
          No meals added yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <MealCard meal={meal} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MealPlanner;
