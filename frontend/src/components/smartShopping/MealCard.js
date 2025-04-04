import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import KitchenIcon from "@mui/icons-material/Kitchen";

const MealCard = ({ meal, showActions = true, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 5,
          transition: "0.3s",
          background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
          overflow: "hidden",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {meal.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {meal.description}
          </Typography>

          <Chip
            label={meal.category}
            color="primary"
            size="small"
            sx={{
              fontWeight: "bold",
              mb: 1.5,
              backgroundColor: "#e3f2fd",
              color: "#1976d2",
            }}
          />

          {/* 🍴 Calories & Price */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              p: 1.5,
              borderRadius: 3,
              bgcolor: "#f9f9f9",
              boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="body2" fontWeight="bold" color="text.primary">
              🍽 Calories: {meal.calories} kcal
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{
                color: "green",
                bgcolor: "#e8f5e9",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              💰 Price: ${meal.price}
            </Typography>
          </Box>

          {/* 🧾 Ingredients */}
          {meal.ingredients?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <KitchenIcon sx={{ color: "#6d4c41" }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Ingredients
                </Typography>
              </Box>

              <List dense disablePadding>
                {meal.ingredients.map((ing, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      py: 0.5,
                      px: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <ListItemText primary={ing.name} />
                    <Chip
                      label={`${ing.quantity} ${ing.unit}`}
                      size="small"
                      color="secondary"
                      sx={{ fontWeight: "bold" }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {showActions && (
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: "none" }}
                onClick={onEdit}
              >
                ✏ Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ textTransform: "none" }}
                onClick={onDelete}
              >
                🗑 Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MealCard;
