import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";

const SaveListForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mealIds, items } = location.state || {};
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const today = new Date().toISOString().split("T")[0]; // Format: yyyy-mm-dd

  const handleSave = async () => {
    if (!name || !date || !items || !mealIds) {
      return alert(
        "❗ Please fill in all fields and ensure list data is available."
      );
    }

    const selectedDate = new Date(date);
    const currentDate = new Date(today);

    if (selectedDate < currentDate) {
      return alert("❗ You cannot select a past date.");
    }

    try {
      await axios.post("http://localhost:8070/api/shopping-list/save", {
        name,
        date,
        mealIds,
        items,
      });
      alert("✅ Shopping list saved successfully!");
      navigate("/saved-lists");
    } catch (err) {
      console.error("❌ Error saving shopping list:", err);
      alert("Error saving shopping list. Try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #fefefe, #e3f2fd)",
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
          maxWidth: "600px",
          borderRadius: 4,
          border: "2px solid #e0e0e0",
          backgroundColor: "#ffffffee",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          📝 Save Shopping List
        </Typography>

        <Box display="flex" flexDirection="column" gap={3} mt={3}>
          <TextField
            label="List Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ backgroundColor: "#fafafa", borderRadius: 1 }}
          />
          <TextField
            label="Shopping Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
            required
            fullWidth
            sx={{ backgroundColor: "#fafafa", borderRadius: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            💾 Save List
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SaveListForm;
