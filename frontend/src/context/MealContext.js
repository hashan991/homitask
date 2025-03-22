import { createContext, useState, useEffect } from "react";
import mealService from "../services/mealService";

export const MealContext = createContext();

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await mealService.getMeals();
        setMeals(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <MealContext.Provider value={{ meals, setMeals, loading }}>
      {children}
    </MealContext.Provider>
  );
};
