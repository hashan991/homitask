import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #fefefe, #e7efff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: 4,
          border: "2px solid #e0e0e0",
          backgroundColor: "#ffffffdd",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          p: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartCheckoutIcon sx={{ fontSize: 32, color: "#1976d2" }} />
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
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            Save This List
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <PriceCheckIcon color="success" />
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ color: "#2e7d32" }}
          >
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
                    px: 1,
                  }}
                >
                  <Typography color="#333">{item.name}</Typography>
                  <Chip
                    label={`${item.quantity} ${item.unit}`}
                    color="primary"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#e3f2fd",
                      color: "#0d47a1",
                      px: 1.5,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ShoppingList;
