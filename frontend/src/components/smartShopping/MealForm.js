import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  Button,
  Typography,
  Card,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DeleteIcon from "@mui/icons-material/Delete";

const MealForm = ({ onMealSubmit }) => {
  const [meal, setMeal] = useState({
    name: "",
    description: "",
    price: "",
    calories: "",
    category: "Breakfast",
    ingredients: [],
  });

  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...meal.ingredients];
    updated[index][field] = value;
    setMeal({ ...meal, ingredients: updated });
  };

  const handleAddIngredient = () => {
    setMeal({
      ...meal,
      ingredients: [...meal.ingredients, { name: "", quantity: "", unit: "" }],
    });
  };

  const handleRemoveIngredient = (index) => {
    const updated = [...meal.ingredients];
    updated.splice(index, 1);
    setMeal({ ...meal, ingredients: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onMealSubmit(meal);
    setMeal({
      name: "",
      description: "",
      price: "",
      calories: "",
      category: "Breakfast",
      ingredients: [],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        elevation={8}
        sx={{ p: 4, borderRadius: "15px", maxWidth: "700px", mx: "auto" }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Add a New Recipe 🍲
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Meal Name"
            name="name"
            value={meal.name}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <RestaurantIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Description"
            name="description"
            value={meal.description}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Price ($)"
            name="price"
            value={meal.price}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Calories"
            name="calories"
            value={meal.calories}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FitnessCenterIcon />
                </InputAdornment>
              ),
            }}
          />

          <Select
            name="category"
            value={meal.category}
            onChange={handleChange}
            fullWidth
            sx={{ background: "#fff", borderRadius: "8px" }}
          >
            {["Breakfast", "Lunch", "Dinner", "Snack"].map((cat) => (
              <MenuItem key={cat} value={cat}>
                <FastfoodIcon sx={{ mr: 1 }} />
                {cat}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="h6" fontWeight="bold" mt={2}>
            🧾 Ingredients
          </Typography>

          {meal.ingredients.map((ingredient, index) => (
            <Grid container spacing={1} key={index}>
              <Grid item xs={5}>
                <TextField
                  label="Name"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleIngredientChange(index, "quantity", e.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Unit"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={() => handleRemoveIngredient(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Button
            onClick={handleAddIngredient}
            variant="outlined"
            startIcon={<AddIcon />}
          >
            Add Ingredient
          </Button>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            sx={{
              mt: 2,
              background: "linear-gradient(to right, #ff416c, #ff4b2b)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "10px",
              "&:hover": {
                background: "linear-gradient(to right, #ff4b2b, #ff416c)",
              },
            }}
          >
            Add Meal
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default MealForm;
