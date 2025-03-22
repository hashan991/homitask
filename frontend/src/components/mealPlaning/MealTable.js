import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MealTable() {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch meals from the server
  const fetchMeals = async () => {
    try {
      const response = await fetch('http://localhost:8070/mealPlaning/');
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      } else {
        console.error('Failed to fetch meals');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleUpdate = (meal) => {
    navigate('/dashMealForm', { state: { meal } });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8070/mealPlaning/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchMeals();
        alert('Meal deleted successfully');
      } else {
        alert('Failed to delete meal');
      }
    } catch (error) {
      alert('An error occurred while deleting the meal.');
    }
  };

  const filteredMeals = meals.filter(meal =>
    meal.mealName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group meals by day
  const mealsByDay = filteredMeals.reduce((acc, meal) => {
    if (!acc[meal.day]) acc[meal.day] = [];
    acc[meal.day].push(meal);
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f4f7' }}>
      <h1 style={{ textAlign: 'center', color: '#3a3b3c', fontSize: '36px', fontWeight: '700', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>Meal Plan</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '14px',
            width: '350px',
            borderRadius: '25px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            fontSize: '16px',
            outline: 'none',
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          onFocus={(e) => e.target.style.boxShadow = '0 4px 10px rgba(0, 123, 255, 0.2)'}
        />
      </div>

      {Object.keys(mealsByDay).map(day => (
        <div key={day} style={{ marginBottom: '40px' }}>
          <h2 style={{
            color: '#4caf50',
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '15px',
            letterSpacing: '1px',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 1s ease-out',
          }}>
            📅 {day}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
            {mealsByDay[day].map(meal => (
              <div key={meal._id} style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                width: '280px',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                cursor: 'pointer',
                transform: 'scale(1)',
                animation: 'fadeInUp 0.8s ease-in-out',
              }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <h3 style={{
                  color: '#ff5722',
                  fontSize: '22px',
                  marginBottom: '10px',
                  textTransform: 'capitalize',
                  animation: 'colorChange 2s infinite alternate',
                }}>
                  {meal.mealName}
                </h3>
                <p style={{
                  color: '#757575',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontStyle: 'italic',
                  animation: 'fadeIn 1s ease-out',
                }}>
                  {meal.ingredients?.join(', ')}
                </p>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  textTransform: 'uppercase',
                }}>
                  {meal.mealType}
                </span>
                <p style={{
                  color: '#6c757d',
                  fontSize: '14px',
                  marginBottom: '10px',
                  animation: 'fadeIn 1.2s ease-out',
                }}>
                  🍽 Calories: {meal.calories} kcal
                </p>
                <p style={{
                  color: '#6c757d',
                  fontSize: '14px',
                  marginBottom: '10px',
                  animation: 'fadeIn 1.4s ease-out',
                }}>
                  🍳 Recipe: {meal.recipe}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => handleUpdate(meal)}
                    style={{
                      padding: '8px 18px',
                      backgroundColor: '#8bc34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#66bb6a'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#8bc34a'; e.target.style.transform = 'scale(1)'; }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(meal._id)}
                    style={{
                      padding: '8px 18px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.3s ease, transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#e53935'; e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#f44336'; e.target.style.transform = 'scale(1)'; }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
