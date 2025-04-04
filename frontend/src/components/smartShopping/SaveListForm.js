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

  const handleSave = async () => {
    if (!name || !date || !items || !mealIds) {
      return alert(
        "❗Please fill in all fields and ensure list data is available."
      );
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
    <Container maxWidth="sm" sx={{ pt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📝 Save Shopping List
        </Typography>
        <Box display="flex" flexDirection="column" gap={3} mt={2}>
          <TextField
            label="List Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Shopping Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button variant="contained" onClick={handleSave}>
            Save List
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SaveListForm;
