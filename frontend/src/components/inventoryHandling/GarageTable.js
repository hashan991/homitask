import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.category.toLowerCase() === "garage"
  );

  const filteredRemoveInventory = groupByItem(removeInventory).filter(
    (item) => item.category.toLowerCase() === "garage"
  );

  const mergedInventory = filteredInventory.map((item) => {
    const removedItem = filteredRemoveInventory.find(
      (i) => i.name === item.name
    ) || { quantity: 0 };
    return {
      ...item,
      quantity: item.quantity - removedItem.quantity,
    };
  });

  const isBelowThreshold = (item) => {
    const threshold = THRESHOLDS[item.quantityType?.toLowerCase()] || 0;
    return item.quantity <= threshold;
  };

  return (
    <Box sx={{ background: "#f0f2f5", minHeight: "100vh", py: 6 }}>
      <Paper
        elevation={5}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          borderRadius: 4,
          px: 4,
          py: 5,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{ color: "#2c3e50", mb: 4 }}
        >
          🛠️ Garage Inventory
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <TextField
            placeholder="Search Item"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 350,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          />
        </Box>

        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#ede7f6" }}>
                {[
                  "Item Name",
                  "Remaining Qty",
                  "Category",
                  "Unit",
                  "Expiry Date",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#5e35b1",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "15px",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mergedInventory.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{
                    backgroundColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      color: isBelowThreshold(item) ? "#e53935" : "#2e7d32",
                      fontWeight: "bold",
                    }}
                  >
                    {item.quantity} {isBelowThreshold(item) ? "⚠️" : ""}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.category}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.quantityType}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
