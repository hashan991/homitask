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
} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const MealForm = ({ onMealSubmit }) => {
  const [meal, setMeal] = useState({
    name: "",
    description: "",
    price: "",
    calories: "",
    category: "Breakfast",
  });

  const handleChange = (e) => {
    setMeal({ ...meal, [e.target.name]: e.target.value });
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
        sx={{
          p: 4,
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "600px",
          mx: "auto",
        }}
      >
        {/* 🍽️ Form Title */}
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{
            color: "rgba(251, 19, 19, 0.3)",
            
            mb: 3,
          }}
        >
          Add a New Recipes 🍕
        </Typography>

        {/* 📝 Meal Form */}
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
            variant="outlined"
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
            label="Meal Description"
            name="description"
            value={meal.description}
            onChange={handleChange}
            variant="outlined"
            multiline
            rows={3}
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
            variant="outlined"
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
            variant="outlined"
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
            variant="outlined"
            sx={{
              background: "#fff",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            <MenuItem value="Breakfast">
              <FastfoodIcon sx={{ mr: 1 }} />
              Breakfast
            </MenuItem>
            <MenuItem value="Lunch">
              <FastfoodIcon sx={{ mr: 1 }} />
              Lunch
            </MenuItem>
            <MenuItem value="Dinner">
              <FastfoodIcon sx={{ mr: 1 }} />
              Dinner
            </MenuItem>
            <MenuItem value="Snack">
              <FastfoodIcon sx={{ mr: 1 }} />
              Snack
            </MenuItem>
          </Select>

          {/* ✨ Animated Add Meal Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              sx={{
                background: "linear-gradient(to right, #ff416c, #ff4b2b)",
                boxShadow: "0px 5px 15px rgba(255, 65, 108, 0.4)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                py: 1.2,
                borderRadius: "10px",
                "&:hover": {
                  background: "linear-gradient(to right, #ff4b2b, #ff416c)",
                },
              }}
            >
              Add Meal
            </Button>
          </motion.div>
        </Box>
      </Card>
    </motion.div>
  );
};

export default MealForm;
