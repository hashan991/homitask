import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
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
import autoTable from "jspdf-autotable";

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
    const input = document.getElementById("reportCaptureArea");

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Inventory_Report_${new Date().toLocaleDateString()}.pdf`);
    });
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
      {/* PDF Content Area */}
      <div id="reportCaptureArea">
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#dbe1e8",
            padding: 3,
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Box sx={{ mr: 3 }}>
            <img
              src="/logo.png"
              alt="PRI Rubber Logo"
              style={{ width: 100, height: 100, borderRadius: "8px" }}
            />
          </Box>
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              align="center"
              fontWeight="bold"
            >
              🧾 Inventory Report Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              This report provides a performance summary of the HomiTask
              system's inventory handling module. It highlights key aspects such
              as real-time stock tracking, item usage monitoring, and low-stock
              detection. The report offers insights into inventory efficiency,
              frequently used items, and restocking needs, helping users manage
              household supplies effectively and reduce waste.
            </Typography>
          </Box>
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

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
      </div>

      {/* Download Button - Visible on Web Only */}
      <Box textAlign="right" mt={2}>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          📥 Download Report as PDF
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryReport;
