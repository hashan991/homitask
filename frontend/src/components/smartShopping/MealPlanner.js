import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import MealForm from "./MealForm";
import MealCard from "./MealCard";

const MealPlanner = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMeal, setEditMeal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  // 🔹 Delete a meal (DELETE request to backend)
  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/meals/${id}`);
      setMeals(meals.filter((meal) => meal._id !== id));
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  // 🔹 Open Edit Dialog
  const handleOpenEditDialog = (meal) => {
    setEditMeal(meal);
    setOpenDialog(true);
  };

  // 🔹 Close Edit Dialog
  const handleCloseEditDialog = () => {
    setEditMeal(null);
    setOpenDialog(false);
  };

  // 🔹 Update Meal (PUT request to backend)
  const handleUpdateMeal = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8070/api/meals/${editMeal._id}`,
        editMeal
      );
      setMeals(
        meals.map((meal) => (meal._id === editMeal._id ? response.data : meal))
      );
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating meal:", error);
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
          color: "#rgba(0,0,0,0.4)",
          textShadow: "0px 2px 5px rgba(0,0,0,0.4)",
          mb: 3,
        }}
      >
        🍽️New Recipes
      </Typography>

      {/* 📜 Meal Form */}
      <MealForm onMealSubmit={handleMealSubmit} />

      {/* 🍱 Meals List */}
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="left"
        sx={{
          color: "#rgba(0,0,0,0.4)",
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
                <MealCard
                  meal={meal}
                  onDelete={() => handleDeleteMeal(meal._id)}
                  onEdit={() => handleOpenEditDialog(meal)}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✏️ Edit Meal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Meal</DialogTitle>
        <DialogContent>
          <TextField
            label="Meal Name"
            fullWidth
            margin="dense"
            value={editMeal?.name || ""}
            onChange={(e) => setEditMeal({ ...editMeal, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={editMeal?.description || ""}
            onChange={(e) =>
              setEditMeal({ ...editMeal, description: e.target.value })
            }
          />
          <TextField
            label="Price ($)"
            fullWidth
            margin="dense"
            type="number"
            value={editMeal?.price || ""}
            onChange={(e) =>
              setEditMeal({ ...editMeal, price: e.target.value })
            }
          />
          <TextField
            label="Calories"
            fullWidth
            margin="dense"
            type="number"
            value={editMeal?.calories || ""}
            onChange={(e) =>
              setEditMeal({ ...editMeal, calories: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateMeal}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealPlanner;
