import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

export default function ShoppingTable() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchShoppingItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8070/rshopping/');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.shoppingLists)) {
          setShoppingLists(data.shoppingLists);
        } else {
          setError('Unexpected response format');
        }
      } else {
        setError('Failed to fetch shopping items');
      }
    } catch (error) {
      setError('An error occurred while fetching shopping items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingItems();
  }, []);

  const handleUpdate = (list, shoppingItem) => {
    navigate('/dashUpdateForm', { state: { list, shoppingItem } });
  };

  const handleDeleteItem = async (listId, itemId) => {
    try {
      const response = await fetch(`http://localhost:8070/rshopping/delete/${listId}/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchShoppingItems();
        alert('Item deleted successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete item');
      }
    } catch (error) {
      alert('An error occurred while deleting the item.');
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const response = await fetch(`http://localhost:8070/rshopping/delete/${listId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchShoppingItems();
        alert('Shopping list deleted successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to delete shopping list');
      }
    } catch (error) {
      alert('An error occurred while deleting the shopping list.');
    }
  };

  const filteredShoppingLists = shoppingLists.map((list) => ({
    ...list,
    items: list.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', marginTop: 20 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Shopping Lists
      </Typography>
      <TextField
        label="Search by Item Name"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" align="center" variant="h6" mt={3}>
          {error}
        </Typography>
      )}
      {filteredShoppingLists.map((list, index) => (
        <Card key={list._id} sx={{ mb: 3, p: 2, boxShadow: 10, borderRadius: 3 }}> {/* 3D effect */}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Shopping List {index + 1}
            </Typography>
            <Button variant="contained" color="error" onClick={() => handleDeleteList(list._id)} sx={{ mb: 2 }}>
              Delete Entire List
            </Button>
            <Table sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 5 }}> {/* Rounded table with shadow */}
              <TableHead sx={{ background: 'linear-gradient(135deg,rgb(145, 45, 160),rgb(22, 124, 83))', color: 'white' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estimate Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.items.map((item) => (
                  <TableRow key={item._id} sx={{ backgroundColor: '#F3E5F5', '&:hover': { backgroundColor: '#E1BEE7' } }}> {/* Soft 3D hover effect */}
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.quantityType}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>Rs.{item.estimatedPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleUpdate(list, item)} sx={{ mr: 1 }}>
                        Update
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDeleteItem(list._id, item._id)}>
                        Delete Item
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
