import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";

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

        // Filter meals by IDs
        const selectedMeals = allMeals.filter((meal) =>
          list.mealIds.includes(meal._id)
        );

        // Sum prices
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
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🛒 {list.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        📅 {new Date(list.date).toLocaleDateString()}
      </Typography>

      {/* 💰 Display total price */}
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
        💰 Total Meal Price: ${totalPrice.toFixed(2)}
      </Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        <List dense>
          {list.items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.name} - ${item.quantity} ${item.unit}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ViewList;
