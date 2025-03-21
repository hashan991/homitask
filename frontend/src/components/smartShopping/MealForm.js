import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Select,
  Button,
  Typography,
  Card,
} from "@mui/material";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";

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
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {/* 🍽️ Form Title */}
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{
            color: "#333",
            textShadow: "0px 2px 5px rgba(0,0,0,0.3)",
            mb: 3,
          }}
        >
          Add a New Meal 🍕
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
          />
          <Select
            name="category"
            value={meal.category}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ background: "#fff", borderRadius: "5px" }}
          >
            <MenuItem value="Breakfast">Breakfast</MenuItem>
            <MenuItem value="Lunch">Lunch</MenuItem>
            <MenuItem value="Dinner">Dinner</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
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
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                boxShadow: "0px 5px 15px rgba(106, 17, 203, 0.4)",
                color: "#fff",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(to right, #2575fc, #6a11cb)",
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
