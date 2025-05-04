import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { fetchReport } from "../../services/reportApi";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

function ReportPage() {
  const [report, setReport] = useState(null);

  const handleDownloadPDF = () => {
    const input = document.getElementById("reportContent");

    // Hide the download button before rendering
    const button = document.querySelector(".no-print");
    if (button) button.style.display = "none";

    html2canvas(input, {
      scrollY: -window.scrollY,
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("report.pdf");

      // Restore button visibility
      if (button) button.style.display = "flex";
    });
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchReport();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    loadReport();
  }, []);

  if (!report) {
    return <div>Loading Report...</div>;
  }

  const budgetAmount = report.budget?.amount || 0;
  const totalCost = report.mealsSummary?.totalCost || 0;
  const totalMeals = report.mealsSummary?.totalMeals || 0;
  const totalCalories = report.mealsSummary?.totalCalories || 0;

  const budgetUsedPercent = ((totalCost / budgetAmount) * 100).toFixed(2);
  const remainingBudget = (budgetAmount - totalCost).toFixed(2);

  const averageMealPrice = (totalCost / totalMeals).toFixed(2);
  const averageMealCalories = (totalCalories / totalMeals).toFixed(2);

  const mostExpensiveMeal = report.mealsList?.reduce((prev, current) =>
    prev.price > current.price ? prev : current
  );
  const highestCalorieMeal = report.mealsList?.reduce((prev, current) =>
    prev.calories > current.calories ? prev : current
  );

  const mealCategoryData = report.mealsSummary?.categories
    ? Object.entries(report.mealsSummary.categories).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <Box id="reportContent" sx={{ padding: 4 }}>
      {/* Header Section with Logo and Company Info */}
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
            📋 AI Meal Planning Report
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            This report provides a performance summary of the HomiTask system's
            meal planning module. It highlights key aspects such as user-defined
            budget allocation, meal cost analysis, and automated shopping list
            generation. The report offers insights into budget utilization,
            average meal costs, and ingredient management, helping users plan
            meals efficiently while staying within their financial limits.
          </Typography>
        </Box>
      </Box>

      {/* Budget Summary */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                💰 Budget Overview
              </Typography>

              <Typography variant="body1" sx={{ mt: 1 }}>
                <b>Budget Amount:</b>{" "}
                <CountUp end={budgetAmount} duration={1} /> LKR
              </Typography>

              <Typography variant="body1">
                <b>Total Cost:</b> <CountUp end={totalCost} duration={1} /> LKR
              </Typography>

              <Typography
                variant="body1"
                color={remainingBudget >= 0 ? "green" : "error"}
              >
                <b>Remaining Budget:</b>{" "}
                <CountUp end={remainingBudget} duration={1} /> LKR
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="caption">Budget Usage</Typography>
                <LinearProgress
                  variant="determinate"
                  value={budgetUsedPercent > 100 ? 100 : budgetUsedPercent}
                  sx={{ height: 10, borderRadius: 5 }}
                  color={budgetUsedPercent <= 100 ? "primary" : "error"}
                />
                <Typography variant="body2" align="right">
                  {budgetUsedPercent}% used
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                📊 Meal Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mealCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {mealCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Meal Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, textAlign: "center" }}>
            <FastfoodIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h6">Total Meals</Typography>
            <Typography variant="h4">
              <CountUp end={totalMeals} duration={2} />
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, textAlign: "center" }}>
            <WhatshotIcon sx={{ fontSize: 40 }} color="error" />
            <Typography variant="h6">Calories</Typography>
            <Typography variant="h4">
              <CountUp end={totalCalories} duration={2} /> kcal
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, textAlign: "center" }}>
            <MonetizationOnIcon sx={{ fontSize: 40 }} color="success" />
            <Typography variant="h6">Avg Meal Price</Typography>
            <Typography variant="h4">
              <CountUp end={averageMealPrice} duration={2} /> LKR
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, textAlign: "center" }}>
            <LocalGroceryStoreIcon sx={{ fontSize: 40 }} color="secondary" />
            <Typography variant="h6">Avg Calories/Meal</Typography>
            <Typography variant="h4">
              <CountUp end={averageMealCalories} duration={2} />
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Special Meal List */}
      <Typography variant="h5" gutterBottom>
        📋 Special Meals (Expensive or High Calorie)
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meal Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price (LKR)</TableCell>
              <TableCell>Calories (kcal)</TableCell>
              <TableCell>Tags</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.mealsList
              ?.filter((meal) => {
                const isExpensive = meal.price > totalCost / totalMeals;
                const isHighCalorie = meal.calories > 600;
                return isExpensive || isHighCalorie;
              })
              .map((meal) => (
                <TableRow key={meal._id}>
                  <TableCell>{meal.name}</TableCell>
                  <TableCell>{meal.category}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        meal.price > totalCost / totalMeals ? "red" : "inherit",
                    }}
                  >
                    {meal.price}
                  </TableCell>
                  <TableCell
                    sx={{ color: meal.calories > 600 ? "orange" : "inherit" }}
                  >
                    {meal.calories}
                  </TableCell>
                  <TableCell>
                    {/* Use simple styled Boxes instead of Chip */}
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {meal.price > totalCost / totalMeals && (
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.5,
                            bgcolor: "red",
                            color: "white",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                          }}
                        >
                          Expensive
                        </Box>
                      )}
                      {meal.calories > 600 && (
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.5,
                            bgcolor: "orange",
                            color: "white",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                          }}
                        >
                          High Calorie
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ mb: 3 }} />

      {/* 🛒 Smart Shopping Lists */}
      <Box>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mt: 30 }}
        >
          🛒 Shopping Lists (Smart Report)
        </Typography>

        <Grid container spacing={3}>
          {report.shoppingLists?.map((list, index) => {
            const unitTotals = {};
            const ingredientCount = {};
            const missingUnits = [];
            let totalWeight = 0;

            list.items.forEach((item) => {
              if (!item.unit) {
                missingUnits.push(item.name);
              } else {
                unitTotals[item.unit] =
                  (unitTotals[item.unit] || 0) + item.quantity;

                if (item.unit === "g" || item.unit === "ml") {
                  totalWeight += item.quantity;
                }
              }
              ingredientCount[item.name] =
                (ingredientCount[item.name] || 0) + 1;
            });

            const topIngredients = Object.entries(ingredientCount)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5);

            const heaviestItems = list.items
              .filter((item) => item.unit === "g" || item.unit === "ml")
              .sort((a, b) => b.quantity - a.quantity)
              .slice(0, 5);

            const mostCommonUnit = Object.entries(unitTotals).sort(
              (a, b) => b[1] - a[1]
            )[0]?.[0];

            const totalQuantities = Object.values(unitTotals).reduce(
              (sum, qty) => sum + qty,
              0
            );

            const averageQuantityPerItem = (
              totalQuantities / list.items.length
            ).toFixed(2);

            return (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ p: 3, boxShadow: 4, borderRadius: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    🛒 {list.name}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {new Date(list.date).toLocaleDateString()}
                  </Typography>

                  {/* Linked Meals - Total Items - Unique Ingredients */}
                  <Box
                    sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
                  >
                    <Chip
                      label={`Linked Meals: ${list.linkedMeals.length}`}
                      color="primary"
                    />
                    <Chip
                      label={`Total Items: ${list.totalItems}`}
                      color="secondary"
                    />
                    <Chip
                      label={`Unique Ingredients: ${list.uniqueIngredients.length}`}
                      color="success"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* 📦 Total Quantity Per Unit */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    📦 Total Quantity per Unit:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      alignContent: "flex-start",
                      overflow: "visible",
                      minHeight: "auto",
                    }}
                  >
                    {Object.entries(unitTotals).map(([unit, total]) => (
                      <Chip
                        key={unit}
                        label={`${unit}: ${total}`}
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  {/* 🏋️ Top 5 Heaviest Ingredients */}
                  <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                    🏋️ Top 5 Heaviest Ingredients (g/ml):
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      alignContent: "flex-start",
                      overflow: "visible",
                      minHeight: "auto",
                    }}
                  >
                    {heaviestItems.map((item, idx) => (
                      <Chip
                        key={idx}
                        label={`${item.name}: ${item.quantity}${item.unit}`}
                        color="warning"
                      />
                    ))}
                  </Box>

                  {/* 📏 Shopping Summary */}
                  <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                    📏 Shopping Summary:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      alignContent: "flex-start",
                      overflow: "visible",
                      minHeight: "auto",
                    }}
                  >
                    <Chip
                      label={`Total Weight: ${totalWeight} g/ml`}
                      variant="outlined"
                    />
                    <Chip
                      label={`Average Qty/Item: ${averageQuantityPerItem}`}
                      variant="outlined"
                    />
                    <Chip
                      label={`Most Common Unit: ${mostCommonUnit || "-"}`}
                      variant="outlined"
                    />
                  </Box>

                  {/* 🚨 Missing Unit Warning */}
                  {missingUnits.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="subtitle1"
                        color="error"
                        sx={{ mb: 1 }}
                      >
                        🚨 Missing Units:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          alignContent: "flex-start",
                          overflow: "visible",
                          minHeight: "auto",
                        }}
                      >
                        {missingUnits.map((name, idx) => (
                          <Chip
                            key={idx}
                            label={name}
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box
        className="no-print"
        sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}
      >
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          size="medium"
        >
          📄 Download Report as PDF
        </Button>
      </Box>
    </Box>
  );
}

export default ReportPage;
