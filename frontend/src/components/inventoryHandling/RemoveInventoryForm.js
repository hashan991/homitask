import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RemoveInventoryForm() {
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
    expiryDate: "", // Expiry Date field for removal
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
        expiryDate: item.expiryDate || "", // Set Expiry Date if available
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
    if (!formData.expiryDate) newErrors.expiryDate = "Expire Date is required"; // Validate expiry date

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
        ? `http://localhost:8070/api/removeinventory/update/${inventoryId}`
        : "http://localhost:8070/api/removeinventory/add";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Item ${isEditMode ? "updated" : "added"} to removed inventory successfully`);
        navigate("/dashremoveinventorytable");
      } else {
        alert(`Failed to ${isEditMode ? "update" : "add"} item to removed inventory`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while ${isEditMode ? "updating" : "adding"} the removed item.`);
    }
  };

return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "117vh",
      backgroundImage:
        "url('https://cdn.pixabay.com/photo/2024/10/19/12/21/vegetables-9132663_1280.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative",
    }}
  >
    {/* Dark Blur Overlay */}
    <div
      style={{
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
    ></div>

    {/* White Theme Card */}
    <div
      style={{
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
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontWeight: "600",
          fontSize: "24px",
          color: "#333",
          letterSpacing: "1px",
        }}
      >
        Removed Inventory Form
      </h2>

      {/* Form continues... */}

      <form onSubmit={handleSubmit}>
        {[
          { id: "name", label: "Item Name", type: "text" },
          { id: "quantity", label: "Quantity", type: "number" },
          { id: "threshold", label: "Threshold", type: "number" },
          {
            id: "expiryDate",
            label: "Expire Date",
            type: "date",
            min: new Date().toISOString().split("T")[0], // 👈 Set today as the minimum date
          },
        ].map(({ id, label, type }) => (
          <div style={{ marginBottom: "15px" }} key={id}>
            <label htmlFor={id}>{label}</label>
            <input
              type={type}
              id={id}
              name={id}
              value={formData[id]}
              onChange={handleChange}
              min={
                id === "expiryDate"
                  ? new Date().toISOString().split("T")[0]
                  : undefined
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            />

            {errors[id] && (
              <div style={{ color: "pink", fontSize: "12px" }}>
                {errors[id]}
              </div>
            )}
          </div>
        ))}

        {/* Quantity Type Dropdown */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="quantityType">Quantity Type:</label>
          <select
            id="quantityType"
            name="quantityType"
            value={formData.quantityType}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <option value="" disabled>
              Select Quantity Type
            </option>
            {quantityTypeOptions.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.quantityType && (
            <div style={{ color: "pink", fontSize: "12px" }}>
              {errors.quantityType}
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <div style={{ color: "pink", fontSize: "12px" }}>
              {errors.category}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
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
          {isEditMode ? "Update Removed Item" : "Add to Removed Inventory"}
        </button>

        {/* View Table Button */}
        <button
          type="button"
          onClick={() => navigate("/dashremoveinventorytable")}
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
          View Remove Inventory Table
        </button>
      </form>
    </div>
  </div>
);


}
