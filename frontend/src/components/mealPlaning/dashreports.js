import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { 
  Card, CardContent, Typography, CircularProgress, Box, Grid, 
  Paper, Divider, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

export default function MealReport() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('meals'); // 'meals' or 'analytics'
  const [nutritionSummary, setNutritionSummary] = useState({
    caloriesByDay: [],
    mealTypeDistribution: [],
    macroDistribution: { protein: 20, carbs: 50, fat: 30 } // Default values
  });

  const fetchMeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8070/mealPlaning/');
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        if (data.some(meal => meal.day === today)) {
          setSelectedDay(today);
        }
        calculateNutritionSummary(data);
      } else {
        console.error('Failed to fetch meals');
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const calculateNutritionSummary = (mealsData) => {
    // Calculate calories by day
    const caloriesByDay = [];
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const mealsByDay = mealsData.reduce((acc, meal) => {
      if (!acc[meal.day]) acc[meal.day] = [];
      acc[meal.day].push(meal);
      return acc;
    }, {});

    weekdays.forEach(day => {
      const dayMeals = mealsByDay[day] || [];
      const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      caloriesByDay.push({
        day,
        calories: totalCalories
      });
    });

    // Calculate meal type distribution
    const mealTypeCounts = {};
    mealsData.forEach(meal => {
      const type = meal.mealType || 'Other';
      mealTypeCounts[type] = (mealTypeCounts[type] || 0) + 1;
    });

    const mealTypeDistribution = Object.keys(mealTypeCounts).map(type => ({
      name: type,
      value: mealTypeCounts[type]
    }));

    setNutritionSummary({
      caloriesByDay,
      mealTypeDistribution,
      macroDistribution: { protein: 20, carbs: 50, fat: 30 } // Using default values, update with real data if available
    });
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const mealsByDay = meals.reduce((acc, meal) => {
    if (!acc[meal.day]) acc[meal.day] = [];
    acc[meal.day].push(meal);
    return acc;
  }, {});

  const sortedDays = Object.keys(mealsByDay).sort((a, b) => weekdays.indexOf(a) - weekdays.indexOf(b));

  const getMealIcon = (type) => {
    const mealType = type.toLowerCase();
    if (mealType.includes('breakfast')) return '🍳';
    if (mealType.includes('lunch')) return '🥗';
    if (mealType.includes('dinner')) return '🍽️';
    if (mealType.includes('snack')) return '🍌';
    return '🍴';
  };

  const downloadPDF = () => {
    const input = document.body;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('meal-plan-report.pdf');
    });
  };

  // Calculate weekly nutritional stats
  const weeklyStats = {
    totalCalories: Object.values(mealsByDay).flat().reduce((sum, meal) => sum + (meal.calories || 0), 0),
    mealCount: Object.values(mealsByDay).flat().length,
    averageCaloriesPerMeal: Math.round(
      Object.values(mealsByDay).flat().reduce((sum, meal) => sum + (meal.calories || 0), 0) / 
      (Object.values(mealsByDay).flat().length || 1)
    ),
    highestCalorieDay: nutritionSummary.caloriesByDay.length > 0 ? 
      nutritionSummary.caloriesByDay.reduce((prev, current) => 
        (prev.calories > current.calories) ? prev : current
      ) : { day: 'N/A', calories: 0 }
  };

  // Chat-like message suggestions based on meal plan
  const mealSuggestions = [
    { id: 1, message: "Looks like you have high-calorie meals on weekends. Consider balancing with more vegetables and lean proteins.", type: 'tip' },
    { id: 2, message: "Try to include more water-rich foods in your breakfast to stay hydrated throughout the day.", type: 'hydration' },
    { id: 3, message: "Your protein intake seems optimal! Keep it up to support your fitness goals.", type: 'positive' },
    { id: 4, message: "Consider adding more fiber-rich foods to your meals for better digestive health.", type: 'health' }
  ];

  // COLORS for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  const MACRO_COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div style={styles.container}>


<Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#dbe1e8",
          padding: 3,
          borderRadius: 2,
          mb: 4,
        }}
      >
        {/* Logo */}
        <Box sx={{ mr: 3 }}>
          <img
            src="/logo.png" // replace with your actual path
            alt="PRI Rubber Logo"
            style={{ width: 100, height: 100, borderRadius: "8px" }}
          />
        </Box>

        {/* Company Info */}
        <Box>
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            📋 Weekly Meal Plan Report
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
          This report provides an overview of the Weekly Meal Plan 📅 feature in the Home Stock Management System 🏠. It outlines core functionalities such as personalized meal scheduling 🍽️, integration with user dietary preferences 🥗, and alignment with stock availability 📦. The module supports efficient meal organization by analyzing existing inventory 🔍, suggesting recipes 📖, and minimizing food waste 🚯. It also contributes to automated shopping list generation 🛒 and ensures nutritional 🥦 and budget-conscious 💰 planning throughout the week.
          </Typography>
        </Box>
      </Box>




      <div style={styles.header}>
        <div style={styles.buttonContainer}>
          <button onClick={downloadPDF} style={styles.printButton}>
            📄 Download PDF
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <div style={styles.mainTabs}>
          <button 
            style={{
              ...styles.mainTab,
              ...(activeTab === 'meals' ? styles.activeMainTab : {})
            }}
            onClick={() => setActiveTab('meals')}
          >
            🍽️ Meal Plan
          </button>
          <button 
            style={{
              ...styles.mainTab,
              ...(activeTab === 'analytics' ? styles.activeMainTab : {})
            }}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Nutrition Analytics
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your meal plan...</p>
        </div>
      ) : sortedDays.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>🍽️</div>
          <p style={styles.emptyStateText}>No meals available.</p>
        </div>
      ) : (
        <>
          {activeTab === 'meals' && (
            <>
              <div style={styles.dayTabs}>
                {sortedDays.map(day => (
                  <button
                    key={`tab-${day}`}
                    style={{
                      ...styles.dayTab,
                      ...(selectedDay === day ? styles.activeTab : {})
                    }}
                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  >
                    {day}
                  </button>
                ))}
                {selectedDay && (
                  <button 
                    style={styles.viewAllButton}
                    onClick={() => setSelectedDay(null)}
                  >
                    View All
                  </button>
                )}
              </div>

              <div style={styles.daysContainer}>
                {sortedDays
                  .filter(day => selectedDay === null || day === selectedDay)
                  .map(day => (
                    <div key={day} style={styles.dayCard} className="day-card">
                      <h2 style={styles.dayTitle}>{day}</h2>
                      <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                          <thead>
                            <tr>
                              <th style={styles.th}>Meal Type</th>
                              <th style={styles.th}>Meal Name</th>
                              <th style={styles.th}>Calories</th>
                              <th style={styles.th}>Ingredients</th>
                              <th style={styles.th}>Recipe</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mealsByDay[day].map((meal, index) => (
                              <tr 
                                key={meal._id || index} 
                                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                              >
                                <td style={styles.td}>
                                  <div style={styles.mealTypeContainer}>
                                    <span style={styles.mealIcon}>{getMealIcon(meal.mealType)}</span>
                                    <span>{meal.mealType}</span>
                                  </div>
                                </td>
                                <td style={{...styles.td, fontWeight: 500}}>{meal.mealName}</td>
                                <td style={styles.td}>
                                  <span style={styles.calorieTag}>
                                    {meal.calories || 0} cal
                                  </span>
                                </td>
                                <td style={styles.td}>
                                  {meal.ingredients?.length ? (
                                    <div style={styles.ingredientsContainer}>
                                      {meal.ingredients.map((ingredient, i) => (
                                        <span key={i} style={styles.ingredientTag}>
                                          {ingredient}
                                        </span>
                                      ))}
                                    </div>
                                  ) : '-'}
                                </td>
                                <td style={styles.td}>
                                  <div style={styles.recipeText}>
                                    {meal.recipe || '-'}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div style={styles.analyticsContainer}>
              <div style={styles.statsCards}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>🔥</div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statTitle}>Total Weekly Calories</h3>
                    <p style={styles.statValue}>{weeklyStats.totalCalories}</p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>🍽️</div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statTitle}>Total Meals</h3>
                    <p style={styles.statValue}>{weeklyStats.mealCount}</p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>⚖️</div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statTitle}>Avg. Calories/Meal</h3>
                    <p style={styles.statValue}>{weeklyStats.averageCaloriesPerMeal}</p>
                  </div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>📈</div>
                  <div style={styles.statInfo}>
                    <h3 style={styles.statTitle}>Highest Calorie Day</h3>
                    <p style={styles.statValue}>{weeklyStats.highestCalorieDay.day} ({weeklyStats.highestCalorieDay.calories} cal)</p>
                  </div>
                </div>
              </div>

              <div style={styles.chartsContainer}>
                <div style={styles.chartCard}>
                  <h3 style={styles.chartTitle}>Daily Calorie Distribution</h3>
                  <div style={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={nutritionSummary.caloriesByDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="calories" fill="#4CAF50" name="Calories" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={styles.doubleChartRow}>
                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Meal Type Distribution</h3>
                    <div style={styles.chartWrapper}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={nutritionSummary.mealTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {nutritionSummary.mealTypeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Macro Distribution</h3>
                    <div style={styles.chartWrapper}>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Protein', value: nutritionSummary.macroDistribution.protein },
                              { name: 'Carbs', value: nutritionSummary.macroDistribution.carbs },
                              { name: 'Fat', value: nutritionSummary.macroDistribution.fat }
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[0, 1, 2].map(index => (
                              <Cell key={`cell-${index}`} fill={MACRO_COLORS[index % MACRO_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat-like Suggestions Section */}
              <div style={styles.suggestionsSection}>
                <h3 style={styles.suggestionTitle}>Meal Plan Suggestions</h3>
                <div style={styles.chatContainer}>
                  {mealSuggestions.map(suggestion => (
                    <div key={suggestion.id} style={styles.chatMessage}>
                      <div style={styles.messageIcon}>
                        {suggestion.type === 'tip' ? '💡' : 
                         suggestion.type === 'hydration' ? '💧' :
                         suggestion.type === 'positive' ? '👍' : '❤️'}
                      </div>
                      <div style={styles.messageContent}>
                        {suggestion.message}
                      </div>
                    </div>
                  ))}

                  {/* Interactive Suggestion Input */}
                  <div style={styles.chatInputContainer}>
                    <input 
                      type="text" 
                      placeholder="Ask about your meal plan..." 
                      style={styles.chatInput}
                    />
                    <button style={styles.chatSendButton}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media print {
            button {
              display: none !important;
            }

            .day-card {
              page-break-inside: avoid;
              margin-bottom: 20px;
              break-inside: avoid;
            }

            body {
              font-size: 12pt;
              background: white;
              color: black;
            }
          }

          .day-card {
            animation: fadeIn 0.4s ease-out;
          }

          .hover-expand:hover {
            max-height: none;
            overflow: visible;
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  header: {
    marginBottom: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  printButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s ease',
  },
  mainTabs: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  mainTab: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
  },
  activeMainTab: {
    backgroundColor: '#4CAF50',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(76, 175, 80, 0.2)',
    borderRadius: '50%',
    borderTop: '5px solid #4CAF50',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px 0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  emptyStateIcon: {
    fontSize: '60px',
    marginBottom: '15px',
  },
  emptyStateText: {
    fontSize: '18px',
    color: '#666',
  },
  dayTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    padding: '10px 0',
  },
  dayTab: {
    padding: '10px 16px',
    fontSize: '15px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#4CAF50',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  viewAllButton: {
    padding: '10px 16px',
    fontSize: '15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    marginLeft: 'auto',
    transition: 'all 0.2s ease',
  },
  daysContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  dayCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  dayTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #4CAF50',
    color: '#2c3e50',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '15px',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #e9ecef',
    fontSize: '14px',
  },
  evenRow: {
    backgroundColor: '#f8f9fa',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  mealTypeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mealIcon: {
    fontSize: '20px',
  },
  calorieTag: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  ingredientsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  ingredientTag: {
    display: 'inline-block',
    padding: '3px 8px',
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    borderRadius: '4px',
    fontSize: '12px',
  },
  recipeText: {
    maxHeight: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
  },
  
  // Analytics styles
  analyticsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  statsCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '10px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  statIcon: {
    fontSize: '32px',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: 0,
  },
  chartsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  chartTitle: {
    fontSize: '18px',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
  },
  chartWrapper: {
    margin: '0 auto',
  },
  doubleChartRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '20px',
  },
  
  // Suggestions styles
  suggestionsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  suggestionTitle: {
    fontSize: '18px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  chatMessage: {
    display: 'flex',
    gap: '12px',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    maxWidth: '90%',
  },
  messageIcon: {
    fontSize: '24px',
  },
  messageContent: {
    fontSize: '15px',
    color: '#343a40',
    lineHeight: '1.5',
  },
  chatInputContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  chatInput: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '30px',
    border: '1px solid #ced4da',
    fontSize: '15px',
    outline: 'none',
  },
  chatSendButton: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};