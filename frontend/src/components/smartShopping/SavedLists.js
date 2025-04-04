import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartCheckout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import VisibilityIcon from "@mui/icons-material/Visibility";

const SavedLists = () => {
  const [lists, setLists] = useState([]);
  const [mealsMap, setMealsMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListsAndMeals = async () => {
      try {
        const listRes = await axios.get(
          "http://localhost:8070/api/shopping-list/all"
        );
        setLists(listRes.data);

        const mealRes = await axios.get("http://localhost:8070/api/meals");
        const map = {};
        mealRes.data.forEach((meal) => {
          map[meal._id] = meal;
        });
        setMealsMap(map);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchListsAndMeals();
  }, []);

  const calculateTotalPrice = (mealIds) => {
    if (!mealIds || !mealsMap) return 0;
    return mealIds.reduce((sum, id) => {
      const meal = mealsMap[id];
      return sum + (meal?.price || 0);
    }, 0);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <ShoppingCartIcon color="primary" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">
          Saved Shopping Lists
        </Typography>
      </Box>

      {lists.length === 0 ? (
        <Typography>No saved lists found.</Typography>
      ) : (
        <List>
          {lists.map((list) => (
            <Paper
              key={list._id}
              elevation={3}
              sx={{ mb: 3, p: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
            >
              <Box mb={1}>
                <Typography variant="h6" fontWeight="bold">
                  📝 {list.name}
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <ListItem disableGutters>
                <ListItemIcon>
                  <CalendarMonthIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={`Date: ${new Date(list.date).toLocaleDateString()}`}
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon>
                  <PriceCheckIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={`Total Meal Price: $${calculateTotalPrice(
                    list.mealIds
                  ).toFixed(2)}`}
                />
              </ListItem>

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate("/view-list", { state: { list } })}
                >
                  View List
                </Button>
              </Box>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default SavedLists;
