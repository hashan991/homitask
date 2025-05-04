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

   const pricePattern = /^\d+(\.\d{1,2})?$/;
   if (!pricePattern.test(meal.price)) {
     alert(
       "Please enter a valid price with up to two decimal places (e.g., 22.34)"
     );
     return;
   }

   const confirm = window.confirm("Do you want to add this meal?");
   if (!confirm) return;

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
            label="Price (Rs.)"
            name="price"
            value={meal.price}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) {
                setMeal({ ...meal, price: val });
              }
            }}
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
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || /^[0-9\b]+$/.test(val)) {
                setMeal({ ...meal, calories: val });
              }
            }}
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
              {/* Name Field */}
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

              {/* Quantity Field */}
              <Grid item xs={3}>
                <TextField
                  label="Quantity"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) {
                      handleIngredientChange(index, "quantity", val);
                    }
                  }}
                  fullWidth
                  required
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9]+([.][0-9]{1,2})?",
                  }}
                />
              </Grid>

              {/* Unit Field */}
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

              {/* Remove Button */}
              <Grid item xs={1}>
                <IconButton
                  onClick={() => handleRemoveIngredient(index)}
                  color="error"
                  aria-label="delete"
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
