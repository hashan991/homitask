import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MealForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypeOptions = ["Breakfast", "Lunch", "Tea-Time", "Dinner"];

  const [formData, setFormData] = useState({
    day: "",
    mealType: "",
    mealName: "",
    ingredients: "",
    recipe: "",
    calories: "",
    availabilityStatus: true,
  });

  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [mealId, setMealId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.meal) {
      const meal = location.state.meal;
      setFormData({
        day: meal.day,
        mealType: meal.mealType,
        mealName: meal.mealName,
        ingredients: meal.ingredients.join(", "),
        recipe: meal.recipe,
        calories: meal.calories,
        availabilityStatus: meal.availabilityStatus,
      });
      setMealId(meal._id);
      setIsEditMode(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mealName') {
      // Allow only letters and spaces, remove numbers and special characters
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
    } else if (name === 'calories') {
      // Allow only positive numbers
      const filteredValue = value.replace(/[^0-9]/g, '');
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.day) newErrors.day = "Day is required";
    if (!formData.mealType) newErrors.mealType = "Meal Type is required";
    if (!formData.mealName) newErrors.mealName = "Meal Name is required";
    if (!formData.ingredients)
      newErrors.ingredients = "Ingredients are required";
    if (!formData.recipe) newErrors.recipe = "Recipe is required";
    if (
      !formData.calories ||
      isNaN(formData.calories) ||
      formData.calories <= 0
    ) {
      newErrors.calories = "Calories should be a positive number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = isEditMode
        ? `http://localhost:8070/mealPlaning/update/${mealId}`
        : "http://localhost:8070/mealPlaning/add";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        }),
      });

      if (response.ok) {
        alert(`Meal ${isEditMode ? "updated" : "added"} successfully`);
        navigate("/dashMealTable");
      } else {
        alert(`Failed to ${isEditMode ? "update" : "add"} meal`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        `An error occurred while ${
          isEditMode ? "updating" : "adding"
        } the meal.`
      );
    }
  };

  const handleViewMealPlan = () => {
    navigate("/dashMealTable");
  };

  return (
    <div style={outerContainerStyle}>
      <div style={overlayStyle}></div>
      <div style={glassCardStyle}>
        <h2 style={headerStyle}>{isEditMode ? "Edit Meal" : "Add New Meal"}</h2>
        <form onSubmit={handleSubmit} style={formElementStyle}>
          {/* Day Dropdown */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Day:</label>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="" disabled>
                Select Day
              </option>
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {errors.day && <span style={errorStyle}>{errors.day}</span>}
          </div>

          {/* Meal Type */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Meal Type:</label>
            <select
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="" disabled>
                Select Meal Type
              </option>
              {mealTypeOptions.map((meal) => (
                <option key={meal} value={meal}>
                  {meal}
                </option>
              ))}
            </select>
            {errors.mealType && (
              <span style={errorStyle}>{errors.mealType}</span>
            )}
          </div>

          {/* Meal Name */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Meal Name:</label>
            <input
              type="text"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.mealName && (
              <span style={errorStyle}>{errors.mealName}</span>
            )}
          </div>

          {/* Ingredients */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Ingredients (comma separated):</label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.ingredients && (
              <span style={errorStyle}>{errors.ingredients}</span>
            )}
          </div>

          {/* Recipe */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Recipe:</label>
            <textarea
              name="recipe"
              value={formData.recipe}
              onChange={handleChange}
              style={textareaStyle}
            ></textarea>
            {errors.recipe && <span style={errorStyle}>{errors.recipe}</span>}
          </div>

          {/* Calories */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Calories:</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.calories && (
              <span style={errorStyle}>{errors.calories}</span>
            )}
          </div>

          {/* Buttons */}
          <div style={buttonContainerStyle}>
            <button type="submit" style={buttonStyle}>
              {isEditMode ? "Update Meal" : "Submit Meal"}
            </button>
            <button
              type="button"
              onClick={handleViewMealPlan}
              style={viewButtonStyle}
            >
              View Meal Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==== Styles ====
const outerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "166vh",
  backgroundImage:
    "url('https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backdropFilter: "blur(3px)",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 0,
};

const glassCardStyle = {
  position: "relative",
  zIndex: 1,
  background: "rgba(255, 255, 255, 0.85)",
  padding: "40px 50px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  maxWidth: "550px",
  width: "90%",
  color: "#222",
};

const headerStyle = {
  textAlign: "center",
  fontSize: "32px",
  marginBottom: "20px",
};

const formElementStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "5px",
  fontWeight: "600",
  fontSize: "16px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const textareaStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  minHeight: "80px",
};

const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginTop: "4px",
};

const buttonStyle = {
  backgroundColor: "#6a1b9a",
  color: "#fff",
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const viewButtonStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  marginTop: "20px",
};


const labelAnimation = {
  color: '#6a1b9a',
  animation: 'borderWave 2s infinite',
};

