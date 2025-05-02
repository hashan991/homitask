import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const EditShoppingList = () => {
  const { state } = useLocation();
  const { list } = state || {};
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    date: "",
    mealIds: [],
    items: [],
  });

  useEffect(() => {
    if (list) {
      setForm({
        name: list.name,
        date: list.date?.substring(0, 10),
        mealIds: list.mealIds,
        items: list.items,
      });
    }
  }, [list]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, key, value) => {
    const updated = [...form.items];
    updated[index][key] = value;
    setForm({ ...form, items: updated });
  };

  const handleRemoveItem = (index) => {
    const updated = [...form.items];
    updated.splice(index, 1);
    setForm({ ...form, items: updated });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:8070/api/shopping-list/${list._id}`,
        form
      );
      alert("✅ Shopping list updated successfully!");
      navigate("/saved-lists");
    } catch (error) {
      console.error("❌ Error updating list:", error);
      alert("Failed to update list.");
    }
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
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: 4,
          border: "2px solid #e0e0e0",
          backgroundColor: "#ffffffcc",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} color="text.primary">
          ✏️ Edit Shopping List
        </Typography>

        <TextField
          label="List Name"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
        />

        <TextField
          label="Date"
          name="date"
          type="date"
          fullWidth
          margin="normal"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          mt={4}
          mb={1}
          color="text.primary"
        >
          📝 Items
        </Typography>

        {form.items.map((item, index) => (
          <Grid container spacing={2} key={index} alignItems="center" mt={0.5}>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Unit"
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1} sx={{ textAlign: "center" }}>
              <IconButton
                color="error"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to remove this item?"
                  );
                  if (confirmed) {
                    handleRemoveItem(index);
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={5}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            💾 Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditShoppingList;
