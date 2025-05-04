import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Tooltip as MuiTooltip,
  alpha,
  useTheme,
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
  Legend,
  CartesianGrid,
} from "recharts";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

// Custom color palette
const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];
const CHART_COLORS = {
  inStock: "#6366F1",
  lowStock: "#EF4444",
  expiring: "#F59E0B",
  removed: "#94A3B8",
};

const InventoryReport = () => {
  const theme = useTheme();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8070/api/inventory/report"
        );
        const data = await response.json();
        setReport(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading report:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPDF = async () => {
    setIsPdfGenerating(true);
    const input = document.getElementById("reportCaptureArea");

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: "#ffffff",
      });

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
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const StatusChip = ({ label, count, icon, color }) => (
    <Chip
      icon={icon}
      label={`${label}: ${count}`}
      sx={{
        bgcolor: alpha(color, 0.1),
        color: color,
        "& .MuiChip-icon": {
          color: color,
        },
        fontWeight: "medium",
        mb: 1,
      }}
    />
  );

  const renderTable = (title, data, columns, icon, bgColor) => (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          bgcolor: bgColor,
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: alpha(bgColor, 0.1),
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          {title}
        </Typography>
      </Box>

      {Array.isArray(data) && data.length > 0 ? (
        <Box sx={{ borderRadius: 2, overflow: "auto" }}>
          <Table size="small" sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow
                sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}
              >
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.text.secondary,
                      py: 1.5,
                    }}
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    "&:nth-of-type(odd)": {
                      bgcolor: alpha(theme.palette.background.default, 0.3),
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.light, 0.05),
                    },
                  }}
                >
                  {columns.map((col, i) => (
                    <TableCell key={i}>
                      {col.key === "quantity" &&
                      row[col.key] <= (row.threshold || 5) ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            component="span"
                            color="error.main"
                            fontWeight="medium"
                          >
                            {row[col.key]}
                          </Typography>
                          <MuiTooltip title="Low stock">
                            <WarningAmberIcon
                              sx={{
                                ml: 0.5,
                                fontSize: 16,
                                color: "error.main",
                              }}
                            />
                          </MuiTooltip>
                        </Box>
                      ) : col.key === "expiryDate" ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            component="span"
                            color="warning.main"
                            fontWeight="medium"
                          >
                            {row[col.key]}
                          </Typography>
                          <MuiTooltip title="Expiring soon">
                            <AccessTimeIcon
                              sx={{
                                ml: 0.5,
                                fontSize: 16,
                                color: "warning.main",
                              }}
                            />
                          </MuiTooltip>
                        </Box>
                      ) : (
                        <Typography variant="body2">{row[col.key]}</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
          <Typography>No data available.</Typography>
        </Box>
      )}
    </Paper>
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading inventory report...</Typography>
      </Box>
    );
  }

  if (!report) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Failed to load report data. Please try again later.
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#F8FAFC",
        minHeight: "100vh",
      }}
    >
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
          {/* Logo */}
          <Box sx={{ mr: 3 }}>
            <img
              src="/logo.png" // replace with your actual path
              alt="PRI Rubber Logo"
              style={{ width: 100, height: 100, borderRadius: "8px" }}
            />
          </Box>
          {/* Company Info */}
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              align="center"
              fontWeight="bold"
            >
              📋 Inventory Dashboard
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
              A comprehensive overview of your inventory management system,
              providing real-time insights into stock levels, item usage, and
              actionable recommendations.
            </Typography>
          </Box>
                
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            {
              label: "Total Items",
              value: report.totalItems,
              icon: <InventoryIcon sx={{ fontSize: 40, color: COLORS[0] }} />,
              color: COLORS[0],
              description: "Items currently tracked in inventory",
            },
            {
              label: "Low Stock",
              value: report.lowStockCount,
              icon: (
                <WarningAmberIcon sx={{ fontSize: 40, color: COLORS[3] }} />
              ),
              color: COLORS[3],
              description: "Items below threshold level",
            },
            {
              label: "Expiring Soon",
              value: report.expiringSoonCount,
              icon: <AccessTimeIcon sx={{ fontSize: 40, color: COLORS[2] }} />,
              color: COLORS[2],
              description: "Items expiring within 30 days",
            },
            {
              label: "Removed Items",
              value: report.totalRemovedItems,
              icon: <DeleteSweepIcon sx={{ fontSize: 40, color: COLORS[4] }} />,
              color: COLORS[4],
              description: "Items removed in the last 30 days",
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    bgcolor: card.color,
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="text.primary"
                        sx={{ my: 1 }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {card.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: alpha(card.color, 0.1),
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            color: "text.primary",
          }}
        >
          <StackedBarChartIcon sx={{ mr: 1 }} />
          Inventory Analytics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="medium"
                mb={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.primary",
                }}
              >
                <CategoryIcon sx={{ mr: 1, color: CHART_COLORS.inStock }} />
                Inventory by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={report.categorySummary}
                    dataKey="inStock"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {report.categorySummary.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} items`,
                      props.payload.category,
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="medium"
                mb={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.primary",
                }}
              >
                <AccessTimeIcon sx={{ mr: 1, color: CHART_COLORS.expiring }} />
                Expiring Soon by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={report.categorySummary} barSize={30}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    formatter={(value) => [`${value} items`, "Expiring Soon"]}
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Bar
                    dataKey="expiring"
                    fill={CHART_COLORS.expiring}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="medium"
                mb={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.primary",
                }}
              >
                <WarningAmberIcon
                  sx={{ mr: 1, color: CHART_COLORS.lowStock }}
                />
                Low Stock by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={report.categorySummary}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    formatter={(value) => [`${value} items`, "Low Stock"]}
                    contentStyle={{
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lowStock"
                    stroke={CHART_COLORS.lowStock}
                    strokeWidth={3}
                    dot={{ r: 6, fill: "white", strokeWidth: 3 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <Divider sx={{ flex: 1 }} />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mx: 2,
              display: "flex",
              alignItems: "center",
              color: "text.primary",
            }}
          >
            <NotificationsActiveIcon sx={{ mr: 1 }} />
            Action Items
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Tables */}
        {renderTable(
          "Low Stock Items",
          report.lowStockItems,
          [
            { header: "Name", key: "name" },
            { header: "Category", key: "category" },
            { header: "Quantity", key: "quantity" },
            { header: "Threshold", key: "threshold" },
          ],
          <WarningAmberIcon sx={{ color: CHART_COLORS.lowStock }} />,
          CHART_COLORS.lowStock
        )}

        {renderTable(
          "Expiring Soon",
          report.expiringSoon,
          [
            { header: "Name", key: "name" },
            { header: "Category", key: "category" },
            { header: "Expiry Date", key: "expiryDate" },
          ],
          <AccessTimeIcon sx={{ color: CHART_COLORS.expiring }} />,
          CHART_COLORS.expiring
        )}

        {renderTable(
          "Removed Items",
          report.removedItems,
          [
            { header: "Name", key: "name" },
            { header: "Category", key: "category" },
            { header: "Quantity", key: "quantity" },
            { header: "Removed On", key: "createdAt" },
          ],
          <DeleteSweepIcon sx={{ color: CHART_COLORS.removed }} />,
          CHART_COLORS.removed
        )}

        {renderTable(
          "Category Summary",
          report.categorySummary,
          [
            { header: "Category", key: "category" },
            { header: "In Stock", key: "inStock" },
            { header: "Low Stock", key: "lowStock" },
            { header: "Expiring Soon", key: "expiring" },
          ],
          <CategoryIcon sx={{ color: CHART_COLORS.inStock }} />,
          CHART_COLORS.inStock
        )}
      </div>

      {/* Download Button - Visible on Web Only */}
      <Box
        sx={{
          position: "sticky",
          bottom: 20,
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
          pointerEvents: isPdfGenerating ? "none" : "auto",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          startIcon={
            isPdfGenerating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <DownloadIcon />
            )
          }
          disabled={isPdfGenerating}
          sx={{
            borderRadius: 8,
            py: 1.5,
            px: 3,
            bgcolor: "#6366F1",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
            "&:hover": {
              bgcolor: "#4F46E5",
            },
          }}
        >
          {isPdfGenerating ? "Generating PDF..." : "Download Report"}
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryReport;
