import React, { useEffect, useState, useRef } from 'react';
import { 
  Card, CardContent, Typography, CircularProgress, Box, Grid, 
  Paper, Divider, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { 
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Legend, ResponsiveContainer, LineChart, Line, 
  AreaChart, Area
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6f61', '#a4de6c', '#d0ed57'];

export default function DashShoppingReport() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const dashboardRef = useRef(null);

  const fetchShoppingItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8070/rshopping/');
      const data = await response.json();
      if (data.success && Array.isArray(data.shoppingLists)) {
        setShoppingLists(data.shoppingLists);
      } else {
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingItems();
  }, []);

  // Filter data based on time selection
  const getFilteredLists = () => {
    if (timeFilter === 'all') return shoppingLists;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeFilter) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      default:
        return shoppingLists;
    }
    
    return shoppingLists.filter(list => 
      list.createdAt ? new Date(list.createdAt) >= cutoffDate : true
    );
  };

  const filteredLists = getFilteredLists();

  const getTotalEstimatedPrice = () => {
    return filteredLists.reduce((total, list) =>
      total + list.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0), 0
    );
  };

  const getTotalItems = () => {
    return filteredLists.reduce((count, list) => count + list.items.length, 0);
  };

  const getAveragePricePerItem = () => {
    const totalItems = getTotalItems();
    return totalItems > 0 ? getTotalEstimatedPrice() / totalItems : 0;
  };

  const getCategoryData = () => {
    const categoryCount = {};
    filteredLists.forEach(list =>
      list.items.forEach(item => {
        if (item.category) {
          categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        }
      })
    );
    return Object.entries(categoryCount).map(([key, value]) => ({ name: key, value }));
  };

  const getCategoryPriceData = () => {
    const categoryPrices = {};
    filteredLists.forEach(list =>
      list.items.forEach(item => {
        if (item.category) {
          const price = item.estimatedPrice || 0;
          categoryPrices[item.category] = (categoryPrices[item.category] || 0) + price;
        }
      })
    );
    return Object.entries(categoryPrices).map(([key, value]) => ({ name: key, value: parseFloat(value.toFixed(2)) }));
  };

  const getPricePerList = () => {
    return filteredLists.map((list, index) => ({
      name: list.name || `List ${index + 1}`,
      totalPrice: parseFloat(list.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0).toFixed(2))
    }));
  };

  const getSpendingTrendData = () => {
    // Sort lists by date if createdAt is available
    const listsWithDate = filteredLists.filter(list => list.createdAt);
    const sortedLists = [...listsWithDate].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    return sortedLists.map(list => {
      const date = new Date(list.createdAt);
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        price: parseFloat(list.items.reduce((sum, item) => 
          sum + (item.estimatedPrice || 0), 0).toFixed(2)),
        items: list.items.length
      };
    });
  };

  const getPurchaseStatusData = () => {
    let purchased = 0;
    let unpurchased = 0;
    
    filteredLists.forEach(list =>
      list.items.forEach(item => {
        if (item.purchased === true) {
          purchased++;
        } else {
          unpurchased++;
        }
      })
    );
    
    return [
      { name: 'Purchased', value: purchased },
      { name: 'Not Purchased', value: unpurchased }
    ];
  };

  // PDF Download Function
  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    
    setDownloadLoading(true);

    try {
      const dashboard = dashboardRef.current;
      
      // Set a good scale for better quality
      const options = {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      };

      // Create canvas from dashboard
      const canvas = await html2canvas(dashboard, options);
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Initialize PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      // Title
      pdf.setFontSize(16);
      pdf.text('Shopping Report Dashboard', 105, 15, { align: 'center' });
      
      // Calculate how many pages we need
      const heightLeft = imgHeight;
      
      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        20, // Starting position after title
        imgWidth, 
        imgHeight
      );
      
      // Save the PDF
      pdf.save(`Shopping_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (

    
    <div style={{ maxWidth: 1200, margin: 'auto', marginTop: 20, padding: '0 16px' }}>

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
            📋 Shopping List Report
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
          This report provides an analytical overview of the HomiTask system's shopping list module. It emphasizes essential functionalities such as item categorization 🗂️, quantity tracking 📦, estimated price management 💰, and priority-based organization 📌. The module supports efficient budgeting by analyzing total projected costs 📊, highlighting spending trends across categories 📈, and identifying high-priority needs 🔍. It also contributes to minimizing overspending 🚫 and improving inventory accuracy ✅, helping users manage household resources effectively and make informed purchasing decisions 🧾
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          
        </Typography>
        <Box>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              label="Time Period"
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleDownloadPDF}
            disabled={loading || downloadLoading}
            startIcon={<DownloadIcon />}
            sx={{ mr: 2 }}
          >
            {downloadLoading ? 'Generating...' : 'Download PDF'}
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={fetchShoppingItems}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="h6">
            {error}
          </Typography>
        </Paper>
      )}

      <div ref={dashboardRef}>
        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                  <Typography variant="h6" gutterBottom>Shopping Lists</Typography>
                  <Typography variant="h4">{filteredLists.length}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography>Total Items: {getTotalItems()}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                  <Typography variant="h6" gutterBottom>Total Spend</Typography>
                  <Typography variant="h4">Rs.{getTotalEstimatedPrice().toFixed(2)}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography>Avg. Per Item: Rs.{getAveragePricePerItem().toFixed(2)}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                  <Typography variant="h6" gutterBottom>Purchase Status</Typography>
                  <Typography variant="h4">
                    {getPurchaseStatusData()[1].value} items pending
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography>
                    {getPurchaseStatusData()[0].value} items purchased
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* Spending Trend Chart */}
              <Grid item xs={12}>
                <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Spending Trend Over Time</Typography>
                    {getSpendingTrendData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={getSpendingTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            name="Total Price (Rs)" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.3}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="items" 
                            name="Number of Items" 
                            stroke="#82ca9d" 
                            fill="#82ca9d" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 10 }}>
                        Insufficient date information to display trend
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Category Distribution Chart */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Item Categories Distribution
                    </Typography>
                    {getCategoryData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={getCategoryData()}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {getCategoryData().map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 10 }}>
                        No category data available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Price per Category Chart */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Spending by Category
                    </Typography>
                    {getCategoryPriceData().length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getCategoryPriceData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`Rs.${value}`, 'Amount']} />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            name="Amount (Rs)" 
                            fill="#8884d8"
                          >
                            {getCategoryPriceData().map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 10 }}>
                        No category price data available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Price per List Chart */}
              <Grid item xs={12}>
                <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Estimated Price per List
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getPricePerList()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`Rs.${value}`, 'Price']} />
                        <Legend />
                        <Bar dataKey="totalPrice" fill="#82ca9d" name="Total Price" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Purchase Status Chart */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Purchase Status
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getPurchaseStatusData()}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          label
                        >
                          <Cell key="cell-0" fill="#4caf50" />
                          <Cell key="cell-1" fill="#f44336" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Lists Summary */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Shopping Lists
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {filteredLists.length > 0 ? (
                        filteredLists
                          .slice(0, 5)
                          .map((list, index) => (
                            <Paper 
                              key={index}
                              elevation={1} 
                              sx={{ 
                                p: 2, 
                                mb: 2,
                                borderLeft: '4px solid',
                                borderColor: COLORS[index % COLORS.length]
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold">
                                {list.name || `List ${index + 1}`}
                              </Typography>
                              {list.createdAt && (
                                <Typography variant="body2" color="textSecondary">
                                  Created: {new Date(list.createdAt).toLocaleDateString()}
                                </Typography>
                              )}
                              <Typography variant="body2">
                                Items: {list.items.length}
                              </Typography>
                              <Typography variant="body2">
                                Total: Rs.{list.items.reduce((sum, item) =>
                                  sum + (item.estimatedPrice || 0), 0).toFixed(2)}
                              </Typography>
                            </Paper>
                          ))
                      ) : (
                        <Typography variant="body2" color="textSecondary" align="center">
                          No shopping lists available
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
}