import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import Context Providers
import { AuthProvider } from "./context/AuthContext";
import { MealProvider } from "./context/MealContext";
import { BudgetProvider } from "./context/BudgetContext";

// Import Pages
import StartupPage from "./pages/StartupPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";


// Import Components
import DashOrderForm from "./components/test/DashOrderForm";
import DashOrderTable from "./components/test/DsahOrderTable";
import MealPlanner from "./components/smartShopping/MealPlanner";
import BudgetPlanner from "./components/smartShopping/BudgetPlanner";
import DashMealPlanner from "./components/smartShopping/DsahMealPlanner";
import DashBudgetPlanner from "./components/smartShopping/DashBudgetPlanner";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <MealProvider>
        <BudgetProvider>
          <Routes>
            <Route path="/" element={<StartupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/app" element={<Home />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/budget-planner" element={<BudgetPlanner />} />
            <Route path="/dashOrderForm" element={<DashOrderForm />} />
            <Route path="/dashOrderTable" element={<DashOrderTable />} />
            <Route path="/dashmealplanner" element={<DashMealPlanner />} />
            <Route path="/dashbudgetplanner" element={<DashBudgetPlanner />} />
          </Routes>
        </BudgetProvider>
      </MealProvider>
    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
