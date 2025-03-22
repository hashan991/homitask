import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartupPage from "./pages/StartupPage";

import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import DashOrderForm from "./components/test/DashOrderForm";
import DashOrderTable from "./components/test/DsahOrderTable";

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
      <Routes>
        <Route path="/" element={<StartupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<Home />} />
        <Route path="/dashOrderForm" element={<DashOrderForm />} />
        <Route path="/dashOrderTable" element={<DashOrderTable />} />


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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
