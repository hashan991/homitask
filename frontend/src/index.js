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



      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
