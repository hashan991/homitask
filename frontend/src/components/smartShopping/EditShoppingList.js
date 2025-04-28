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
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
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

        <Typography variant="h6" fontWeight="bold" mt={3}>
          📝 Items
        </Typography>

        {form.items.map((item, index) => (
          <Grid container spacing={1} key={index} mt={1}>
            <Grid item xs={5}>
              <TextField
                label="Name"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
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
            <Grid item xs={3}>
              <TextField
                label="Unit"
                value={item.unit}
                onChange={(e) =>
                  handleItemChange(index, "unit", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={() => handleRemoveItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            💾 Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditShoppingList;
