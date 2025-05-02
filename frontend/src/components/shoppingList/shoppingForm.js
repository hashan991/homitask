import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";

export default function ShoppingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const qtyTypes = ["Unit", "Kg", "g", "L", "ml", "m"];
  const categories = ["Kitchen", "Garden", "Garage", "Cleaning"];
  const priorities = ["High", "Medium", "Low"];

  const [formData, setFormData] = useState({
    name: "",
    qty: "",
    qtytype: "",
    cate: "",
    pri: "",
    est: "",
  });

  const [errors, setErrors] = useState({});
  const [itemsList, setItemsList] = useState([]);

  useEffect(() => {
    if (location.state && location.state.ShoppingItem) {
      const ShoppingItem = location.state.ShoppingItem;
      setFormData({
        name: ShoppingItem.name || "",
        qty: ShoppingItem.qty || "",
        qtytype: ShoppingItem.qtytype || "",
        cate: ShoppingItem.cate || "",
        pri: ShoppingItem.pri || "",
        est: ShoppingItem.est || "",
      });
      setItemsList(ShoppingItem.items || []);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let validValue = value;
    if (name === "qty" || name === "est") {
      validValue = value.replace(/[^0-9.]/g, "");
      if (parseFloat(validValue) < 0) validValue = "0";
    }
    setFormData({ ...formData, [name]: validValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product Name is required";
    if (!formData.qty || isNaN(formData.qty) || formData.qty <= 0)
      newErrors.qty = "Quantity should be a positive number";
    if (!formData.est || isNaN(formData.est) || formData.est <= 0)
      newErrors.est = "Estimate Price should be a positive number";
    if (!formData.qtytype) newErrors.qtytype = "Please select a quantity type";
    if (!formData.cate) newErrors.cate = "Please select a category";
    if (!formData.pri) newErrors.pri = "Please select a priority";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;
    const newItem = { ...formData };
    setItemsList((prevItems) => {
      const index = prevItems.findIndex((item) => item.name === formData.name);
      if (index !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[index] = newItem;
        return updatedItems;
      } else {
        return [...prevItems, newItem];
      }
    });
    setFormData({ name: "", qty: "", qtytype: "", cate: "", pri: "", est: "" });
  };

  const handleDeleteItem = (index) => {
    setItemsList(itemsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itemsList.length === 0) {
      alert(
        "No items in the shopping list. Please add items before submitting."
      );
      return;
    }

    const transformedItems = itemsList.map((item) => ({
      name: item.name,
      quantity: parseInt(item.qty, 10),
      quantityType: item.qtytype,
      category: item.cate,
      priority: item.pri,
      estimatedPrice: parseFloat(item.est),
    }));

    try {
      let url, method;
      if (location.state?.ShoppingItem?._id && location.state?.SecondId) {
        url = `http://localhost:8070/rshopping/update/${location.state.ShoppingItem._id}/${location.state.SecondId}`;
        method = "PUT";
      } else {
        url = "http://localhost:8070/rshopping/add";
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: transformedItems }),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (response.ok) {
        alert("Shopping list added successfully");
        navigate("/dashShoppingTable");
      } else {
        alert(
          `Failed to add shopping list. ${
            responseData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the shopping list.");
    }
  };

  const handleViewShoppingList = () => {
    navigate("/dashShoppingTable");
  };

  return (
    <Box
      sx={{
        minHeight: "112vh",
        backgroundImage: `url("https://cdn.pixabay.com/photo/2024/10/19/12/21/vegetables-9132663_1280.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)", // <-- darker background
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.75)",
          padding: "35px 40px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
          width: "100%",
          maxWidth: "500px",
          color: "#222",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          {location.state?.ShoppingItem
            ? "Update Shopping List"
            : "Shopping List Form"}
        </Typography>

        {!location.state?.ShoppingItem && (
          <>
            <TextField
              fullWidth
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              name="qty"
              label="Quantity"
              value={formData.qty}
              onChange={handleChange}
              error={!!errors.qty}
              helperText={errors.qty}
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            />
            <FormControl
              fullWidth
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            >
              <InputLabel>Measurement Units</InputLabel>
              <Select
                name="qtytype"
                value={formData.qtytype}
                onChange={handleChange}
                label="Measurement Units"
              >
                {qtyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.qtytype && (
                <Typography variant="caption" color="error">
                  {errors.qtytype}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="cate"
                value={formData.cate}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {errors.cate && (
                <Typography variant="caption" color="error">
                  {errors.cate}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            >
              <InputLabel>Priority</InputLabel>
              <Select
                name="pri"
                value={formData.pri}
                onChange={handleChange}
                label="Priority"
              >
                {priorities.map((pri) => (
                  <MenuItem key={pri} value={pri}>
                    {pri}
                  </MenuItem>
                ))}
              </Select>
              {errors.pri && (
                <Typography variant="caption" color="error">
                  {errors.pri}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              name="est"
              label="Estimated Price"
              value={formData.est}
              onChange={handleChange}
              error={!!errors.est}
              helperText={errors.est}
              sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
            />

            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleAddItem}
              sx={{ mb: 3 }}
            >
              Add to List
            </Button>
          </>
        )}

        <List>
          {itemsList.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                mb: 1,
                justifyContent: "space-between",
              }}
            >
              <Typography>
                {item.qty} {item.qtytype} - {item.name} ({item.cate}, {item.pri}
                ) - Rs.{item.est}
              </Typography>
              <IconButton onClick={() => handleDeleteItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Button
          type="submit"
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          color="primary"
          disabled={itemsList.length === 0}
          sx={{ mt: 2 }}
          style={{
            backgroundColor: "#e91e63",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            fontSize: "16px",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          {location.state?.ShoppingItem ? "Update Items" : "Submit All Items"}
        </Button>

        <Button
          type="button"
          onClick={handleViewShoppingList}
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer",
          }}
        >
          View Shopping List
        </Button>
      </Box>
    </Box>
  );
}
