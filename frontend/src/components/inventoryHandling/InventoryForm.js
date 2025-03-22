import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


export default function InventoryForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const categoryOptions = ["Kitchen", "Garage", "Cleaning"];
  const quantityTypeOptions = ["Quantity", "Kg", "L", "cm", "ml", "g"];

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    threshold: "",
    quantityType: "",
    expiryDate: "", // New Expire Date field
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
        quantityType: item.quantityType || "",
        expiryDate: item.expiryDate || "", // Set Expire Date if available
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
    if (!formData.expiryDate) newErrors.expiryDate = "Expire Date is required"; // Validate expire date

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let convertedQuantity = parseFloat(formData.quantity);
    switch (formData.quantityType) {
      case "g":
        convertedQuantity = convertedQuantity / 1000;
        formData.quantityType = "Kg";
        break;
      case "ml":
        convertedQuantity = convertedQuantity / 1000;
        formData.quantityType = "L";
        break;
      case "cm":
        convertedQuantity = convertedQuantity / 100;
        formData.quantityType = "m";
        break;
      default:
        break;
    }
    formData.quantity = convertedQuantity;

    try {
      const url = isEditMode
        ? `http://localhost:8070/api/inventory/update/${inventoryId}`
        : "http://localhost:8070/api/inventory/add";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
      >
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "20px 40px",
        borderRadius: "8px",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.3)",
        width: "100%",
        maxWidth: "450px",
        border: "2px solid #3498db", 
        
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#3498db" }}>Inventory Form</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="name" style={{ color: "#333" }}>Item Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}
            />
            {errors.name && <div style={{ color: "red", fontSize: "12px" }}>{errors.name}</div>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <label htmlFor="quantity" style={{ color: "#333" }}>Quantity:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd"
                }}
              />
              {errors.quantity && <div style={{ color: "red", fontSize: "12px" }}>{errors.quantity}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label htmlFor="quantityType" style={{ color: "#333" }}>Quantity Type:</label>
              <select
                id="quantityType"
                name="quantityType"
                value={formData.quantityType}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ddd"
                }}
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
            <label htmlFor="category" style={{ color: "#333" }}>Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}
            >
              <option value="" disabled>Select Category</option>
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <div style={{ color: "red", fontSize: "12px" }}>{errors.category}</div>}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="expiryDate" style={{ color: "#333" }}>Expire Date:</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}
            />
            {errors.expiryDate && <div style={{ color: "red", fontSize: "12px" }}>{errors.expiryDate}</div>}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="threshold" style={{ color: "#333" }}>Threshold:</label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={formData.threshold}
              onChange={handleChange}
              required
              min="0"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd"
              }}
            />
            {errors.threshold && <div style={{ color: "red", fontSize: "12px" }}>{errors.threshold}</div>}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              width: "100%",
              cursor: "pointer",
              marginBottom: "15px"
            }}
          >
            {isEditMode ? "Update Item" : "Add Item"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/dashinventorytable")}
          style={{
            marginTop: "20px",
            backgroundColor: "#e74c3c",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            width: "100%",
            cursor: "pointer"
          }}
        >
          View Table
        </button>
        </div>
      </div>
  );
}
