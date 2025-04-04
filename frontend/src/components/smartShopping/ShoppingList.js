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
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SaveIcon from "@mui/icons-material/Save";

const ShoppingList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mealIds } = location.state || {};
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const fetchShoppingList = async () => {
      if (!mealIds || mealIds.length === 0) return;

      try {
        const res = await axios.post(
          "http://localhost:8070/api/shopping-list",
          { mealIds }
        );
        const combined = combineItems(res.data);
        setShoppingList(combined);
      } catch (err) {
        console.error("❌ Error fetching shopping list:", err);
      }
    };

    fetchShoppingList();
  }, [mealIds]);

  // ✅ Combine items by name + unit
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

  // ✅ Save button handler - navigate to save-list form
  const handleSaveClick = () => {
    navigate("/save-list", {
      state: {
        mealIds,
        items: shoppingList,
      },
    });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#fafafa",
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ShoppingCartIcon sx={{ fontSize: 28, color: "#1976d2" }} />
          <Typography variant="h6" fontWeight="bold">
            Weekly Shopping List
          </Typography>
        </Box>

        {shoppingList.length === 0 ? (
          <Typography color="text.secondary">
            No items in the shopping list.
          </Typography>
        ) : (
          <>
            <List dense>
              {shoppingList.map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    px: 1,
                    py: 0.5,
                    fontSize: "0.95rem",
                  }}
                >
                  <ListItemText
                    primary={`${item.name} - ${item.quantity} ${item.unit}`}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      color: "#333",
                    }}
                  />
                </ListItem>
              ))}
            </List>

            {/* ✅ Save Button */}
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveClick}
                sx={{ textTransform: "none" }}
              >
                Save This List
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ShoppingList;
