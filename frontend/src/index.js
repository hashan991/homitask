import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
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


import DashMealForm from "./components/mealPlaning/DashMealForm";
import DashMealTable from "./components/mealPlaning/DashMealTable";



import { Dashboard } from "@mui/icons-material";
import DashInventoryForm from "./components/inventoryHandling/DashInventoryForm";
import DashInventoryTable from "./components/inventoryHandling/DashInventoryTable";
import DashGarageTable from "./components/inventoryHandling/DashGarageTable";
import DashCleaningTable from "./components/inventoryHandling/DashCleaningTable";
import DashKitchenTable from "./components/inventoryHandling/DashKitchenTable";
import DashRemoveInventoryForm from "./components/inventoryHandling/DashRemoveInventoryForm";
import DashRemoveInventoryTable from "./components/inventoryHandling/DashRemoveInventoryTable";


import DashShoppingForm from "./components/shoppingList/dashShoppingForm";
import DashShoppingTable from "./components/shoppingList/dashShoppingTable";
import DashUpdateForm from "./components/shoppingList/dashUpdateForm";
import UpdateForm from "./components/shoppingList/updateForm";



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

      <Routes>
        <Route path="/" element={<StartupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<Home />} />
        <Route path="/dashOrderForm" element={<DashOrderForm />} />
        <Route path="/dashOrderTable" element={<DashOrderTable />} />


        <Route path="/dashMealForm" element={<DashMealForm />} />
        <Route path="/dashMealTable" element={<DashMealTable />} />


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashinventoryform" element={<DashInventoryForm />} />
        <Route path="/dashinventorytable" element={<DashInventoryTable />} />
        <Route path="/dashgaragetable" element={<DashGarageTable />} />
        <Route path="/dashcleaningtable" element={<DashCleaningTable />} />
        <Route path="/dashkitchentable" element={<DashKitchenTable />} />
        <Route path="/dashremoveinventoryform" element={<DashRemoveInventoryForm />} />
        <Route path="/dashremoveinventorytable" element={<DashRemoveInventoryTable />} />



        <Route path="/dashShoppingForm" element={<DashShoppingForm />} />
        <Route path="/dashShoppingTable" element={<DashShoppingTable />} />
        <Route path="/dashupdateform" element={<DashUpdateForm />} />
        <Route path="/updateForm" element={<UpdateForm />} />
           

      </Routes>

    </AuthProvider>
  </BrowserRouter>
);

reportWebVitals();
