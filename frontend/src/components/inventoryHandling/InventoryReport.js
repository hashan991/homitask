import React, { useEffect, useState } from "react";

import {
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 👈 correct import

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F"];

const InventoryReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8070/api/inventory/report")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Error loading report:", err));
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary Table
    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Total Items", report.totalItems],
        ["Low Stock", report.lowStockCount],
        ["Expiring Soon", report.expiringSoonCount],
        ["Removed Items", report.totalRemovedItems],
      ],
    });

    let y = doc.lastAutoTable.finalY + 10;

    // Low Stock Table
    autoTable(doc, {
      startY: y,
      head: [["Low Stock Items", "Category", "Quantity", "Threshold"]],
      body: report.lowStockItems.map((item) => [
        item.name,
        item.category,
        item.quantity,
        item.threshold,
      ]),
      headStyles: { fillColor: [255, 99, 71] },
    });

    y = doc.lastAutoTable.finalY + 10;

    // Expiring Soon Table
    autoTable(doc, {
      startY: y,
      head: [["Expiring Soon Items", "Category", "Expiry Date"]],
      body: report.expiringSoon.map((item) => [
        item.name,
        item.category,
        new Date(item.expiryDate).toLocaleDateString(),
      ]),
      headStyles: { fillColor: [255, 165, 0] },
    });

    y = doc.lastAutoTable.finalY + 10;

    // Removed Items Table
    autoTable(doc, {
      startY: y,
      head: [["Removed Items", "Category", "Quantity", "Removed On"]],
      body: report.removedItems.map((item) => [
        item.name,
        item.category,
        item.quantity,
        new Date(item.createdAt).toLocaleDateString(),
      ]),
      headStyles: { fillColor: [100, 149, 237] },
    });

    // Download final full PDF
    doc.save(`Inventory_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  const renderTable = (title, data, columns) => (
    <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {Array.isArray(data) && data.length > 0 ? (
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>{col.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col, i) => (
                  <TableCell key={i}>{row[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No data available.</Typography>
      )}
    </Paper>
  );

  if (!report) return <Typography sx={{ p: 4 }}>Loading report...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        🧾 Inventory Report Dashboard
      </Typography>

      {/* Download Button */}
      <Box textAlign="right" mb={2}>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          📥 Download Report as PDF
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: "Total Items", value: report.totalItems },
          { label: "Low Stock", value: report.lowStockCount },
          { label: "Expiring Soon", value: report.expiringSoonCount },
          { label: "Removed Items", value: report.totalRemovedItems },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: "#f5f5f5", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle2">{card.label}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Pie Chart - Items by Category */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" mb={2}>
            📦 Inventory by Category
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={report.categorySummary}
                dataKey="inStock"
                nameKey="category"
                outerRadius={80}
                label
              >
                {report.categorySummary.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Bar Chart - Expiring Soon */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" mb={2}>
            ⏰ Expiring Soon by Category
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={report.categorySummary}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expiring" fill="#ff7f50" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Line Chart - Low Stock by Category */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" mb={2}>
            📉 Low Stock by Category
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={report.categorySummary}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="lowStock" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      {/* Tables */}
      {renderTable("⚠️ Low Stock Items", report.lowStockItems, [
        { header: "Name", key: "name" },
        { header: "Category", key: "category" },
        { header: "Quantity", key: "quantity" },
        { header: "Threshold", key: "threshold" },
      ])}

      {renderTable("⏰ Expiring Soon", report.expiringSoon, [
        { header: "Name", key: "name" },
        { header: "Category", key: "category" },
        { header: "Expiry Date", key: "expiryDate" },
      ])}

      {renderTable("🗑️ Removed Items", report.removedItems, [
        { header: "Name", key: "name" },
        { header: "Category", key: "category" },
        { header: "Quantity", key: "quantity" },
        { header: "Removed On", key: "createdAt" },
      ])}

      {renderTable("📁 Category Summary", report.categorySummary, [
        { header: "Category", key: "category" },
        { header: "In Stock", key: "inStock" },
        { header: "Low Stock", key: "lowStock" },
        { header: "Expiring Soon", key: "expiring" },
      ])}
    </Box>
  );
};

export default InventoryReport;
