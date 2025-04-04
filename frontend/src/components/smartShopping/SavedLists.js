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
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SavedLists = () => {
  const [lists, setLists] = useState([]);
  const [mealsMap, setMealsMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListsAndMeals = async () => {
      try {
        // Fetch all saved shopping lists
        const listRes = await axios.get(
          "http://localhost:8070/api/shopping-list/all"
        );
        setLists(listRes.data);

        // Fetch all meals to map their prices
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

  // ✅ Helper to calculate total price of a list
  const calculateTotalPrice = (mealIds) => {
    if (!mealIds || !mealsMap) return 0;
    return mealIds.reduce((sum, id) => {
      const meal = mealsMap[id];
      return sum + (meal?.price || 0);
    }, 0);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📚 Saved Shopping Lists
      </Typography>

      {lists.length === 0 ? (
        <Typography>No saved lists found.</Typography>
      ) : (
        <List>
          {lists.map((list) => (
            <Paper key={list._id} sx={{ mb: 2, p: 2 }}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/view-list", { state: { list } })}
                  >
                    View List
                  </Button>
                }
              >
                <ListItemText
                  primary={list.name}
                  secondary={
                    <>
                      📅 {new Date(list.date).toLocaleDateString()} <br />
                      💰 Total Meal Price: $
                      {calculateTotalPrice(list.mealIds).toFixed(2)}
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default SavedLists;
