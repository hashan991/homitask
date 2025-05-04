import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ShoppingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    qty: "",
    qtytype: "",
    cate: "",
    pri: "",
    est: "",
  });

  const [errors, setErrors] = useState({});
  const { list, shoppingItem } = location.state || {};

  useEffect(() => {
    if (shoppingItem) {
      setFormData({
        name: shoppingItem.name || "",
        qty: shoppingItem.quantity || "",
        qtytype: shoppingItem.quantityType || "",
        cate: shoppingItem.category || "",
        pri: shoppingItem.priority || "",
        est: shoppingItem.estimatedPrice || "",
      });
    }
  }, [shoppingItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        `http://localhost:8070/rshopping/update/${list._id}/${shoppingItem._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            quantity: formData.qty,
            quantityType: formData.qtytype,
            category: formData.cate,
            priority: formData.pri,
            estimatedPrice: formData.est,
          }),
        }
      );

      if (response.ok) {
        alert("Shopping item updated successfully");
        navigate("/dashShoppingTable");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred while updating the item.");
    }
  };

  return (
    <div style={backgroundContainer}>
      {/* Dark Blur Overlay */}
      <div style={blurOverlay}></div>

      {/* White Glassy Card */}
      <div style={glassCard}>
        <h2 style={titleStyle}>
          {shoppingItem ? "Update Shopping Item" : "Add Shopping Item"}
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            error={errors.name}
          />
          <InputField
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            error={errors.qty}
          />
          <SelectField
            name="qtytype"
            value={formData.qtytype}
            onChange={handleChange}
            options={["Kg", "g", "L", "ml", "Unit"]}
            placeholder="Select Quantity Type"
            error={errors.qtytype}
          />
          <SelectField
            name="cate"
            value={formData.cate}
            onChange={handleChange}
            options={["Kitchen", "Garden", "Garage", "Cleaning"]}
            placeholder="Select Category"
            error={errors.cate}
          />
          <SelectField
            name="pri"
            value={formData.pri}
            onChange={handleChange}
            options={["High", "Medium", "Low"]}
            placeholder="Select Priority"
            error={errors.pri}
          />
          <InputField
            name="est"
            value={formData.est}
            onChange={handleChange}
            placeholder="Estimate Price"
            type="number"
            error={errors.est}
          />
          <button type="submit" style={submitButtonStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable Input Component
const InputField = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}) => (
  <div style={{ marginBottom: "15px" }}>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
    />
    {error && <div style={errorStyle}>{error}</div>}
  </div>
);

// ✅ Reusable Select Component
const SelectField = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
}) => (
  <div style={{ marginBottom: "15px" }}>
    <select name={name} value={value} onChange={onChange} style={inputStyle}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <div style={errorStyle}>{error}</div>}
  </div>
);

// ==== 🎨 Styles ====
const backgroundContainer = {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "117vh",
  backgroundImage:
    "url('https://cdn.pixabay.com/photo/2024/10/19/12/21/vegetables-9132663_1280.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const blurOverlay = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 0,
};

const glassCard = {
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
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  fontWeight: "600",
  fontSize: "24px",
  color: "#333",
  letterSpacing: "1px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
};

const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginTop: "5px",
};

const submitButtonStyle = {
  padding: "12px",
  width: "100%",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
};
