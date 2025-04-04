import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

const ShoppingList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mealIds } = location.state || {};

  const [shoppingList, setShoppingList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchShoppingData = async () => {
      if (!mealIds || mealIds.length === 0) return;

      try {
        const res = await axios.post(
          "http://localhost:8070/api/shopping-list",
          { mealIds }
        );
        const combined = combineItems(res.data.shoppingList || res.data);
        setShoppingList(combined);

        const mealRes = await axios.get("http://localhost:8070/api/meals");
        const allMeals = mealRes.data;
        const selected = allMeals.filter((meal) => mealIds.includes(meal._id));
        const total = selected.reduce(
          (sum, meal) => sum + (meal.price || 0),
          0
        );
        setTotalPrice(total);
      } catch (err) {
        console.error("❌ Error fetching shopping data:", err);
      }
    };

    fetchShoppingData();
  }, [mealIds]);

  const combineItems = (items) => {
    const map = {};
    items.forEach((item) => {
      const key = `${item.name.trim().toLowerCase()}-${item.unit
        .trim()
        .toLowerCase()}`;
      if (map[key]) {
        map[key].quantity += item.quantity;
      } else {
        map[key] = {
          name: item.name.trim(),
          quantity: item.quantity,
          unit: item.unit.trim(),
        };
      }
    });
    return Object.values(map);
  };

  const handleSaveClick = () => {
    navigate("/save-list", {
      state: {
        mealIds,
        items: shoppingList,
        totalCost: totalPrice,
      },
    });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "#fdfdfd",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartCheckoutIcon sx={{ fontSize: 30, color: "#1976d2" }} />
            <Typography variant="h5" fontWeight="bold">
              Your Smart Shopping List
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<SaveAltIcon />}
            onClick={handleSaveClick}
            sx={{
              textTransform: "none",
              backgroundColor: "#1976d2",
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            Save This List
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <PriceCheckIcon color="success" />
          <Typography variant="subtitle1" fontWeight="bold" color="green">
            Total Meal Price: ${totalPrice.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {shoppingList.length === 0 ? (
          <Typography color="text.secondary">
            No items in the shopping list.
          </Typography>
        ) : (
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              🧾 Ingredients List
            </Typography>

            <List dense sx={{ mb: 2 }}>
              {shoppingList.map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography>{item.name}</Typography>
                  <Chip
                    label={`${item.quantity} ${item.unit}`}
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ShoppingList;
