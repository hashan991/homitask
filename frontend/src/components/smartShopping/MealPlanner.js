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

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/api/meals/${id}`);
      setMeals(meals.filter((meal) => meal._id !== id));
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleOpenEditDialog = (meal) => {
    setEditMeal(meal);
    setOpenDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditMeal(null);
    setOpenDialog(false);
  };

  const handleIngredientChange = (index, key, value) => {
    const updatedIngredients = [...editMeal.ingredients];
    updatedIngredients[index][key] = value;
    setEditMeal({ ...editMeal, ingredients: updatedIngredients });
  };

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

      <MealForm onMealSubmit={handleMealSubmit} />

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

      <Dialog
        open={openDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
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

          {/* Ingredient Editor */}
          <Typography variant="subtitle1" fontWeight="bold" mt={2}>
            Ingredients
          </Typography>
          {editMeal?.ingredients?.map((ingredient, index) => (
            <Box key={index} display="flex" gap={1} mt={1}>
              <TextField
                label="Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Qty"
                type="number"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                sx={{ width: "120px" }}
              />
              <TextField
                label="Unit"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                sx={{ width: "100px" }}
              />
            </Box>
          ))}
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
