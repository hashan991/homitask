import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const ViewList = () => {
  const location = useLocation();
  const { list } = location.state || {};
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchAndCalculatePrice = async () => {
      if (!list?.mealIds) return;

      try {
        const res = await axios.get("http://localhost:8070/api/meals");
        const allMeals = res.data;

        const selectedMeals = allMeals.filter((meal) =>
          list.mealIds.includes(meal._id)
        );

        const total = selectedMeals.reduce(
          (sum, meal) => sum + (meal.price || 0),
          0
        );
        setTotalPrice(total);
      } catch (err) {
        console.error("❌ Error calculating total price:", err);
      }
    };

    fetchAndCalculatePrice();
  }, [list]);

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <ShoppingCartCheckoutIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">
          {list.name}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <CalendarMonthIcon color="action" />
        <Typography variant="subtitle1">
          {new Date(list.date).toLocaleDateString()}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AttachMoneyIcon color="success" />
        <Typography variant="subtitle1" fontWeight="bold" color="green">
          Total Meal Price: ${totalPrice.toFixed(2)}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#333" }}
        >
          🧾 Ingredients List
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List dense>
          {list.items.map((item, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="500">{item.name}</Typography>
                    <Chip
                      label={`${item.quantity} ${item.unit}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ViewList;
