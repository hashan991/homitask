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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: 4,
          border: "2px solid #e0e0e0",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffffcc",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          p: 4,
        }}
      >
        {/* Header Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "#ffffffc7",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            mb: 4,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <ShoppingCartCheckoutIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              {list.name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CalendarMonthIcon color="action" />
            <Typography variant="subtitle1" color="text.secondary">
              {new Date(list.date).toLocaleDateString()}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoneyIcon color="success" />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: "#2e7d32" }}
            >
              Total Meal Price: ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* Ingredients List Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "#fafafa",
            boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2, color: "text.primary" }}
          >
            🧾 Ingredients List
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <List dense>
            {list.items.map((item, index) => (
              <ListItem key={index} disableGutters sx={{ mb: 1 }}>
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography fontWeight={500} sx={{ color: "#333" }}>
                        {item.name}
                      </Typography>
                      <Chip
                        label={`${item.quantity} ${item.unit}`}
                        color="primary"
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          backgroundColor: "#e3f2fd",
                          color: "#0d47a1",
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Paper>
    </Box>
  );
};

export default ViewList;
