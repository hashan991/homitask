import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function InventoryForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const categoryOptions = [
    "Kitchen",
    "Garage",
    "Cleaning",
  ];

  const quantityTypeOptions = [
    "Quantity",
    "Kg",
    "L",
    "cm",
    "m",
    "g",
  ];

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    threshold: "",
    quantityType: "", // Will store the selected QuantityType
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [inventoryId, setInventoryId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.item) {
      const item = location.state.item;
      setFormData({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        threshold: item.threshold,
        quantityType: item.quantityType || "", // Set dropdown value
      });
      setInventoryId(item._id);
      setIsEditMode(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Item Name is required";
    if (!formData.quantity || isNaN(formData.quantity) || formData.quantity <= 0)
      newErrors.quantity = "Quantity must be a positive number";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.threshold || isNaN(formData.threshold) || formData.threshold < 0)
      newErrors.threshold = "Threshold must be a non-negative number";
    if (!formData.quantityType) newErrors.quantityType = "Please select a Quantity Type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const url = isEditMode
        ? `http://localhost:8070/api/inventory/update/${inventoryId}`
        : "http://localhost:8070/api/inventory/add";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Item ${isEditMode ? "updated" : "added"} successfully`);
        navigate("/dashinventorytable");
      } else {
        alert(`Failed to ${isEditMode ? "update" : "add"} item`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while ${isEditMode ? "updating" : "adding"} the item.`);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f7f7f7", padding: "10px" }}>
      <div style={{ backgroundColor: "#EDEDEE", padding: "20px 40px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "450px", border: "2px solid #000000" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Inventory Form</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="name" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Item Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", border: errors.name ? "1px solid red" : "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
            />
            {errors.name && <div style={{ color: "red", fontSize: "12px" }}>{errors.name}</div>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <label htmlFor="quantity" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                style={{ width: "100%", padding: "10px", border: errors.quantity ? "1px solid red" : "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
              />
              {errors.quantity && <div style={{ color: "red", fontSize: "12px" }}>{errors.quantity}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="quantityType" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Quantity Type:</label>
              <select
                id="quantityType"
                name="quantityType"
                value={formData.quantityType}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "10px", border: errors.quantityType ? "1px solid red" : "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box", backgroundColor: "#fff" }}
              >
                <option value="" disabled>Select Quantity Type</option>
                {quantityTypeOptions.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              {errors.quantityType && <div style={{ color: "red", fontSize: "12px" }}>{errors.quantityType}</div>}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="category" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "10px", border: errors.category ? "1px solid red" : "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box", backgroundColor: "#fff" }}
            >
              <option value="" disabled>Select Category</option>
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <div style={{ color: "red", fontSize: "12px" }}>{errors.category}</div>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="threshold" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>Threshold:</label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              required
              min="0"
              style={{ width: "100%", padding: "10px", border: errors.threshold ? "1px solid red" : "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" }}
            />
            {errors.threshold && <div style={{ color: "red", fontSize: "12px" }}>{errors.threshold}</div>}
          </div>

          <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {isEditMode ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
