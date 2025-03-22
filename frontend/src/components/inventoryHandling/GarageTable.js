import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";

export default function GarageTable() {
  const [inventory, setInventory] = useState([]);
  const [removeInventory, setRemoveInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const THRESHOLDS = {
    kg: 1,
    l: 1,
    m: 1,
    quantity: 10,
  };

  useEffect(() => {
    fetchInventory();
    fetchRemoveInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:8070/api/inventory");
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchRemoveInventory = async () => {
    try {
      const response = await fetch("http://localhost:8070/api/removeinventory");
      if (response.ok) {
        const data = await response.json();
        setRemoveInventory(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const groupByItem = (items) => {
    return items.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.name === item.name);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  };

  const filteredInventory = groupByItem(inventory).filter(
    (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) && item.category.toLowerCase() === "garage"
  );

  const filteredRemoveInventory = groupByItem(removeInventory).filter(
    (item) => item.category.toLowerCase() === "garage"
  );

  const mergedInventory = filteredInventory.map((item) => {
    const removedItem = filteredRemoveInventory.find((i) => i.name === item.name) || { quantity: 0 };
    return {
      ...item,
      quantity: item.quantity - removedItem.quantity,
    };
  });

  const isBelowThreshold = (item) => {
    const threshold = THRESHOLDS[item.quantityType.toLowerCase()] || 0;
    return item.quantity <= threshold;
  };

  return (
    <Box sx={{ padding: 3, fontFamily: "Arial, sans-serif" }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: "bold", marginBottom: 3, color: "#2C3E50" }}>
        Garage Inventory
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
        <TextField
          label="Search Item"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "300px",
            backgroundColor: "white",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#7D2CE0" },
              "&:hover fieldset": { borderColor: "#5A1FA3" },
              "&.Mui-focused fieldset": { borderColor: "#5A1FA3" },
            },
          }}
        />
      </Box>

      <Paper sx={{ padding: 2, borderRadius: 3, boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3498DB" }}>
              {["Item Name", "Remaining Qty", "Category", "Unit", "Expiry Date"].map((header) => (
                <TableCell key={header} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow> 
          </TableHead>
          <TableBody>
            {mergedInventory.map((item) => (
              <TableRow key={item.name} sx={{ backgroundColor: isBelowThreshold(item) ? "#FFEBEE" : "white" }}>
                <TableCell sx={{ textAlign: "center" }}>{item.name}</TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    color: isBelowThreshold(item) ? "red" : "black",
                    fontWeight: "bold",
                  }}
                >
                  {item.quantity} {isBelowThreshold(item) ? "🔴" : ""}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>{item.category}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{item.quantityType}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
