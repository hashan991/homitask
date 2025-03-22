import { createContext, useState } from "react";
import budgetService from "../services/budgetService";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(0);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch meal plan based on budget
  const generateMealPlan = async (budgetAmount) => {
    setLoading(true);
    try {
      const data = await budgetService.getMealPlan(budgetAmount);
      setMealPlan(data);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BudgetContext.Provider
      value={{ budget, setBudget, mealPlan, generateMealPlan, loading }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
