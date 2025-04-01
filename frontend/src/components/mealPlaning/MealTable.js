import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MealTable() {
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch meals from the server
  const fetchMeals = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      const confirmDelete = window.confirm('Are you sure you want to delete this meal?');
      if (!confirmDelete) return;
      
      const response = await fetch(`http://localhost:8070/mealPlaning/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchMeals();
        // Using a toast notification style alert
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = 'Meal deleted successfully';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.classList.add('show');
        }, 10);
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 3000);
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

  const mealTypes = {
    breakfast: { color: '#FF9800', icon: '🍳' },
    lunch: { color: '#4CAF50', icon: '🍽️' },
    dinner: { color: '#3F51B5', icon: '🍲' },
    snack: { color: '#9C27B0', icon: '🥨' }
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Sort days according to weekday order
  const sortedDays = Object.keys(mealsByDay).sort((a, b) => {
    return weekdays.indexOf(a) - weekdays.indexOf(b);
  });

  return (
    <div className="meal-planner">
      <header className="header">
        <h1>Your Meal Plan</h1>
        <p>Organize your weekly meals for healthier eating</p>
      </header>

      <div className="search-container">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search meals by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your meal plan...</p>
        </div>
      ) : sortedDays.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M12 17h2v-7h-2zm0-10h2V5h-2z"/>
          </svg>
          <h3>No meals found</h3>
          <p>{searchQuery ? `No meals match "${searchQuery}"` : "Add your first meal to get started"}</p>
        </div>
      ) : (
        <div className="days-container">
          {sortedDays.map(day => (
            <section key={day} className="day-section">
              <h2 className="day-title">
                <span className="day-icon">📅</span> {day}
              </h2>
              <div className="meals-grid">
                {mealsByDay[day].map(meal => {
                  const typeInfo = mealTypes[meal.mealType?.toLowerCase()] || { color: '#607D8B', icon: '🍴' };
                  
                  return (
                    <div key={meal._id} className="meal-card">
                      <div className="meal-header" style={{ backgroundColor: typeInfo.color }}>
                        <span className="meal-type-icon">{typeInfo.icon}</span>
                        <span className="meal-type">{meal.mealType}</span>
                      </div>
                      <div className="meal-content">
                        <h3 className="meal-name">{meal.mealName}</h3>
                        
                        <div className="meal-info">
                          <div className="info-item">
                            <span className="info-icon">🔥</span>
                            <span>{meal.calories || '0'} kcal</span>
                          </div>
                          
                          {meal.ingredients?.length > 0 && (
                            <div className="ingredients">
                              <h4>Ingredients:</h4>
                              <p>{meal.ingredients.join(', ')}</p>
                            </div>
                          )}
                          
                          {meal.recipe && (
                            <div className="recipe">
                              <h4>Preparation:</h4>
                              <p>{meal.recipe}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="meal-actions">
                          <button 
                            onClick={() => handleUpdate(meal)}
                            className="update-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(meal._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <style jsx>{`
        /* Enhanced Meal Planner Styles */
        .meal-planner {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #f9fafb;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0%, rgba(233, 226, 248, 0.28) 90.3%),
            url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23bbc5d7' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          min-height: 100vh;
          padding: 32px 24px;
          color: #1f2937;
        }
        
        /* Stylized header with gradient background */
        .header {
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          margin: -32px -24px 32px -24px;
          padding: 48px 20px 40px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          overflow: hidden;
          box-shadow: 0 3px 20px -10px rgba(144, 173, 229, 0.15);
          text-align: center;
        }
        
        .header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(to right, #FF9800, #4CAF50, #3F51B5, #9C27B0);
        }
        
        .header::after {
          content: "";
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 150px;
          height: 150px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e9ecf8'%3E%3Cpath d='M7,22H9V24H7V22M11,22H13V24H11V22M15,22H17V24H15V22M12,3L3,13H5V21H9V17H15V21H19V13H21L12,3Z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-size: contain;
          opacity: 0.2;
          transform: rotate(15deg);
        }
        
        .header h1 {
          font-size: 36px;
          font-weight: 800;
          margin: 0;
          color: #111827;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .header p {
          color: #6b7280;
          margin-top: 8px;
          font-size: 18px;
        }
        
        .search-container {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }
        
        .search-box {
          position: relative;
          width: 100%;
          max-width: 480px;
        }
        
        .search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 16px;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          fill: #9ca3af;
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 16px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          background-color: #f3f4f6;
          color: #4b5563;
        }
        
        .days-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        
        /* Day section enhancements */
        .day-section {
          position: relative;
          background-color: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.2s ease;
        }
        
        .day-section::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 6px;
          background: linear-gradient(to bottom, var(--day-color, #3b82f6), var(--day-color-2, #60a5fa));
          border-radius: 4px 0 0 4px;
        }
        
        /* Add unique gradient colors for each day */
        .day-section:nth-of-type(1) {
          --day-color: #FF9800;
          --day-color-2: #FFC107;
        }
        
        .day-section:nth-of-type(2) {
          --day-color: #4CAF50;
          --day-color-2: #8BC34A;
        }
        
        .day-section:nth-of-type(3) {
          --day-color: #3F51B5;
          --day-color-2: #7986CB;
        }
        
        .day-section:nth-of-type(4) {
          --day-color: #9C27B0;
          --day-color-2: #CE93D8;
        }
        
        .day-section:nth-of-type(5) {
          --day-color: #E91E63;
          --day-color-2: #F48FB1;
        }
        
        .day-section:nth-of-type(6) {
          --day-color: #009688;
          --day-color-2: #4DB6AC;
        }
        
        .day-section:nth-of-type(7) {
          --day-color: #FF5722;
          --day-color-2: #FF8A65;
        }
        
        .day-title {
          display: flex;
          align-items: center;
          font-size: 24px;
          margin-top: 0;
          margin-bottom: 24px;
          color: #111827;
          font-weight: 700;
        }
        
        .day-icon {
          margin-right: 12px;
        }
        
        .meals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        
        /* Meal card enhancements */
        .meal-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), 
                    box-shadow 0.3s ease;
        }
        
        .meal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        
        .meal-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 100% 100%, transparent 15px, white 15px),
            linear-gradient(to bottom right, transparent 50%, rgba(0,0,0,0.02) 50%);
          border-radius: 12px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .meal-card:hover::before {
          opacity: 1;
        }
        
        .meal-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .meal-header::after {
          content: "";
          position: absolute;
          top: -15px;
          right: -15px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        
        .meal-type-icon {
          margin-right: 8px;
          font-size: 18px;
        }
        
        .meal-type {
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .meal-content {
          padding: 20px;
        }
        
        .meal-name {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }
        
        .meal-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4b5563;
        }
        
        .info-icon {
          font-size: 16px;
        }
        
        .ingredients, .recipe {
          background-color: #f9fafb;
          padding: 12px;
          border-radius: 8px;
        }
        
        .ingredients h4, .recipe h4 {
          margin: 0 0 4px 0;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
        }
        
        .ingredients p, .recipe p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .meal-actions {
          display: flex;
          gap: 12px;
        }
        
        .update-btn, .delete-btn {
          flex: 1;
          padding: 10px 0;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .update-btn {
          background-color: #3b82f6;
          color: white;
        }
        
        .update-btn:hover {
          background-color: #2563eb;
        }
        
        .delete-btn {
          background-color: #ef4444;
          color: white;
        }
        
        .delete-btn:hover {
          background-color: #dc2626;
        }
        
        /* Enhanced loading state */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }
        
        .loader {
          border: 4px solid #f3f3f3;w
          border-top: 4px solid var(--day-color, #3b82f6);
          border-right: 4px solid var(--day-color-2, #60a5fa);
          border-bottom: 4px solid var(--day-color, #3b82f6);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Enhanced empty state */
        .empty-state {
          text-align: center;
          padding: 64px 24px;
          background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }
        
        .empty-state::after {
          content: "";
          position: absolute;
          bottom: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e6e8eb'%3E%3Cpath d='M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-size: contain;
          opacity: 0.2;
          transform: rotate(15deg);
        }
        
        .empty-icon {
          width: 64px;
          height: 64px;
          fill: #9ca3af;
          margin-bottom: 16px;
        }
        
        .empty-state h3 {
          font-size: 20px;
          margin: 0 0 8px 0;
          color: #111827;
        }
        
        .empty-state p {
          color: #6b7280;
          margin: 0;
        }
        
        /* Improved toast notification */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background-color: #10b981;
          background-image: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          opacity: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .toast-notification::before {
          content: "✓";
          display: inline-block;
          margin-right:, 8px;
          font-weight: bold;
        }
        
        .toast-notification.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .meal-planner {
            padding: 24px 16px;
          }
          
          .header {
            margin: -24px -16px 24px -16px;
            padding: 32px 16px 28px;
          }
          
          .header h1 {
            font-size: 28px;
          }
          
          .header p {
            font-size: 16px;
          }
          
          .meals-grid {
            grid-template-columns: 1fr;
          }
          
          .day-section {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}