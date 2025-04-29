import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MealReport() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Weekly Meal Plan Report</h1>
        <div style={styles.buttonContainer}>
          <button onClick={downloadPDF} style={styles.printButton}>
            📄 Download PDF
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
};
