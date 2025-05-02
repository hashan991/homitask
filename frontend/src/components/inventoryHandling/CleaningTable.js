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

export default function CleaningTable() {
  const [inventory, setInventory] = useState([]);
  const [removeInventory, setRemoveInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const THRESHOLD = 10;

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
      item.category.toLowerCase() === "cleaning"
  );

  const filteredRemoveInventory = groupByItem(removeInventory).filter(
    (item) => item.category.toLowerCase() === "cleaning"
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

  return (
    <Box sx={{ background: "#f1f2f6", minHeight: "100vh", py: 6 }}>
      <Paper
        elevation={5}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          borderRadius: 4,
          px: 4,
          py: 5,
          backgroundColor: "#fefefe",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          sx={{ color: "#2c3e50", mb: 4 }}
        >
          🧼 Cleaning Inventory
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <TextField
            placeholder="Search by Item Name"
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
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          />
        </Box>

        {/* Table */}
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 700 }} aria-label="cleaning inventory table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#eee9ff" }}>
                <TableCell sx={headerStyle}>Item Name</TableCell>
                <TableCell sx={headerStyle}>Remaining Quantity</TableCell>
                <TableCell sx={headerStyle}>Category</TableCell>
                <TableCell sx={headerStyle}>Type</TableCell>
                <TableCell sx={headerStyle}>Expiry Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mergedInventory.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#f8f8f8",
                    },
                  }}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      color: item.quantity < THRESHOLD ? "#e53935" : "#2e7d32",
                      fontWeight: "bold",
                    }}
                  >
                    {item.quantity} {item.quantity < THRESHOLD && "⚠️"}
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantityType}</TableCell>
                  <TableCell>
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

// Header Cell Style
const headerStyle = {
  fontWeight: "bold",
  color: "#6a1b9a",
  fontSize: "15px",
  borderBottom: "2px solid #ddd",
};
