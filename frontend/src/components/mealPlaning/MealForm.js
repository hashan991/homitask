import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MealForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypeOptions = ['Breakfast', 'Lunch', 'Tea-Time', 'Dinner'];

  const [formData, setFormData] = useState({
    day: '',
    mealType: '',
    mealName: '',
    ingredients: '',
    recipe: '',
    calories: '',
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
        ingredients: meal.ingredients.join(', '),
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
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.day) newErrors.day = 'Day is required';
    if (!formData.mealType) newErrors.mealType = 'Meal Type is required';
    if (!formData.mealName) newErrors.mealName = 'Meal Name is required';
    if (!formData.ingredients) newErrors.ingredients = 'Ingredients are required';
    if (!formData.recipe) newErrors.recipe = 'Recipe is required';
    if (!formData.calories || isNaN(formData.calories) || formData.calories <= 0) {
      newErrors.calories = 'Calories should be a positive number';
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
        : 'http://localhost:8070/mealPlaning/add';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ingredients: formData.ingredients.split(',').map(i => i.trim()),
        }),
      });

      if (response.ok) {
        alert(`Meal ${isEditMode ? 'updated' : 'added'} successfully`);
        navigate('/dashMealTable');
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'add'} meal`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred while ${isEditMode ? 'updating' : 'adding'} the meal.`);
    }
  };

  const handleViewMealPlan = () => {
    navigate('/dashMealTable');
  };

  return (
    <div className="meal-form-container" style={containerStyle}>
      <div className="meal-form" style={formStyle}>
        <h2 style={headerStyle}>{isEditMode ? 'Edit Meal' : 'Add New Meal'}</h2>
        <form onSubmit={handleSubmit} style={formElementStyle}>
          <div className="form-group" style={inputGroupStyle}>
            <label style={labelStyle}>Day:</label>
            <select name="day" value={formData.day} onChange={handleChange} style={inputStyle} required>
              <option value="" disabled>Select Day</option>
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {errors.day && <span className="error" style={errorStyle}>{errors.day}</span>}
          </div>

          <div className="form-group" style={inputGroupStyle}>
            <label style={labelStyle}>Meal Type:</label>
            <select name="mealType" value={formData.mealType} onChange={handleChange} style={inputStyle} required>
              <option value="" disabled>Select Meal Type</option>
              {mealTypeOptions.map((meal) => (
                <option key={meal} value={meal}>
                  {meal}
                </option>
              ))}
            </select>
            {errors.mealType && <span className="error" style={errorStyle}>{errors.mealType}</span>}
          </div>

          <div className="form-group" style={inputGroupStyle}>
            <label style={labelStyle}>Meal Name:</label>
            <input
              type="text"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            {errors.mealName && <span className="error" style={errorStyle}>{errors.mealName}</span>}
          </div>

          <div className="form-group" style={inputGroupStyle}>
            <label style={labelStyle}>Ingredients (comma separated):</label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            {errors.ingredients && <span className="error" style={errorStyle}>{errors.ingredients}</span>}
          </div>

          <div className="form-group" style={inputGroupStyle}>
            <label style={labelStyle}>Recipe:</label>
            <textarea
              name="recipe"
              value={formData.recipe}
              onChange={handleChange}
              style={textareaStyle}
              required
            ></textarea>
            {errors.recipe && <span className="error" style={errorStyle}>{errors.recipe}</span>}
          </div>

          <div className="form-group" style={inputGroupStyle}>
            <label style={labelStyle}>Calories:</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            {errors.calories && <span className="error" style={errorStyle}>{errors.calories}</span>}
          </div>

          <div style={buttonContainerStyle}>
            <button type="submit" style={buttonStyle}>
              {isEditMode ? 'Update Meal' : 'Submit Meal'}
            </button>
            <button type="button" onClick={handleViewMealPlan} style={viewButtonStyle}>
              View Meal Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Styles for the components
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '160vh',
  background: 'linear-gradient(135deg, #d3d3d3, #f5f5f5)', // Light gray gradient background
  overflow: 'hidden',
};

const formStyle = {
  backgroundColor: '#ffffff',
  padding: '40px 50px',
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  fontFamily: '"Montserrat", sans-serif',
  width: '100%',
  maxWidth: '500px',
  transition: 'transform 0.3s ease',
};

const headerStyle = {
  textAlign: 'center',
  color: '#2C3E50',
  fontSize: '36px',
  marginBottom: '30px',
  fontWeight: '700',
  letterSpacing: '1px',
  fontFamily: '"Montserrat", sans-serif',
};

const formElementStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '25px',
};

const labelStyle = {
  fontSize: '18px',
  color: '#2C3E50',
  fontWeight: '600',
  letterSpacing: '0.5px',
};

const inputStyle = {
  padding: '14px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '15px',
  outline: 'none',
  transition: 'all 0.3s ease',
};

inputStyle[':focus'] = {
  borderColor: '#6a1b9a',
  boxShadow: '0 0 5px rgba(106, 27, 154, 0.5)',
};

const textareaStyle = {
  padding: '14px',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  minHeight: '120px',
  marginBottom: '15px',
  outline: 'none',
  transition: 'all 0.3s ease',
};

textareaStyle[':focus'] = {
  borderColor: '#6a1b9a',
  boxShadow: '0 0 5px rgba(106, 27, 154, 0.5)',
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const errorStyle = {
  color: '#e74c3c',
  fontSize: '14px',
  fontWeight: '500',
};

const buttonStyle = {
  padding: '14px 28px',
  backgroundColor: '#6a1b9a',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

buttonStyle[':hover'] = {
  backgroundColor: '#8e24aa',
  transform: 'translateY(-2px)',
};

const viewButtonStyle = {
  padding: '14px 28px',
  backgroundColor: '#4caf50',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s, transform 0.2s',
  marginTop: '15px',
};

viewButtonStyle[':hover'] = {
  backgroundColor: '#66bb6a',
  transform: 'translateY(-2px)',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '25px',
  alignItems: 'center',
};

const borderAnimation = {
  '@keyframes borderWave': {
    '0%': { borderColor: '#6a1b9a' },
    '50%': { borderColor: '#8e24aa' },
    '100%': { borderColor: '#6a1b9a' },
  },
};

const labelAnimation = {
  color: '#6a1b9a',
  animation: 'borderWave 2s infinite',
};

