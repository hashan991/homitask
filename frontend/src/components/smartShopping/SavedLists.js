import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartCheckout";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SavedLists = () => {
  const [lists, setLists] = useState([]);
  const [mealsMap, setMealsMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListsAndMeals = async () => {
      try {
        const listRes = await axios.get(
          "http://localhost:8070/api/shopping-list/all"
        );
        setLists(listRes.data);

        const mealRes = await axios.get("http://localhost:8070/api/meals");
        const map = {};
        mealRes.data.forEach((meal) => {
          map[meal._id] = meal;
        });
        setMealsMap(map);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchListsAndMeals();
  }, []);

  const calculateTotalPrice = (mealIds) => {
    if (!mealIds || !mealsMap) return 0;
    return mealIds.reduce((sum, id) => {
      const meal = mealsMap[id];
      return sum + (meal?.price || 0);
    }, 0);
  };

  const handleDeleteList = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this list?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8070/api/shopping-list/${id}`);
      setLists((prev) => prev.filter((list) => list._id !== id));
    } catch (err) {
      console.error("Failed to delete list:", err);
    }
  };

 return (
   <Box
     sx={{
       minHeight: "100vh",
       background: "linear-gradient(135deg, #f5f7fa, #e2eafc)", // 🌤️ Light gradient
       display: "flex",
       justifyContent: "center",
       alignItems: "flex-start",
       px: 2,
       py: 6,
     }}
   >
     <Paper
       elevation={8}
       sx={{
         width: "100%",
         maxWidth: "1100px",
         borderRadius: 4,
         p: 4,
         backgroundColor: "#ffffffcc", // semi-transparent white
         border: "1px solid #ddd",
         boxShadow: "0 10px 30px rgba(0, 0, 0, 0.26)",
         backdropFilter: "blur(10px)",
       }}
     >
       <Container maxWidth="md">
         <Box display="flex" alignItems="center" gap={2} mb={4}>
           <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
           <Typography variant="h4" fontWeight="bold" color="text.primary">
             Saved Shopping Lists
           </Typography>
         </Box>

         {lists.length === 0 ? (
           <Typography variant="h6" color="text.secondary">
             No saved lists found.
           </Typography>
         ) : (
           <List>
             {lists.map((list) => (
               <Paper
                 key={list._id}
                 elevation={3}
                 sx={{
                   mb: 4,
                   p: 3,
                   borderRadius: 4,
                   backgroundColor: "#ffffff",
                   border: "1px solid #e0e0e0",
                   boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                   transition: "0.3s",
                   "&:hover": {
                     boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
                     transform: "translateY(-2px)",
                   },
                 }}
               >
                 <Box
                   display="flex"
                   justifyContent="space-between"
                   alignItems="center"
                 >
                   <Typography
                     variant="h6"
                     fontWeight="600"
                     color="text.primary"
                   >
                     📝 {list.name}
                   </Typography>

                   <Box>
                     <Tooltip title="Edit">
                       <IconButton
                         color="primary"
                         onClick={() =>
                           navigate("/edit-list/:id", { state: { list } })
                         }
                       >
                         <EditIcon />
                       </IconButton>
                     </Tooltip>
                     <Tooltip title="Delete">
                       <IconButton
                         color="error"
                         onClick={() => handleDeleteList(list._id)}
                       >
                         <DeleteIcon />
                       </IconButton>
                     </Tooltip>
                   </Box>
                 </Box>

                 <Divider sx={{ my: 2 }} />

                 <ListItem disableGutters>
                   <ListItemIcon>
                     <CalendarMonthIcon color="info" />
                   </ListItemIcon>
                   <ListItemText
                     primary={`Date: ${new Date(
                       list.date
                     ).toLocaleDateString()}`}
                     primaryTypographyProps={{ fontSize: 16 }}
                   />
                 </ListItem>

                 <ListItem disableGutters>
                   <ListItemIcon>
                     <PriceCheckIcon color="success" />
                   </ListItemIcon>
                   <ListItemText
                     primary={`Total Price: $${calculateTotalPrice(
                       list.mealIds
                     ).toFixed(2)}`}
                     primaryTypographyProps={{ fontSize: 16 }}
                   />
                 </ListItem>

                 <Box display="flex" justifyContent="flex-end" mt={3}>
                   <Button
                     variant="contained"
                     startIcon={<VisibilityIcon />}
                     onClick={() => navigate("/view-list", { state: { list } })}
                     sx={{
                       textTransform: "none",
                       fontWeight: "600",
                       borderRadius: 2,
                       px: 3,
                       py: 1,
                     }}
                   >
                     View List
                   </Button>
                 </Box>
               </Paper>
             ))}
           </List>
         )}
       </Container>
     </Paper>
   </Box>
 );

};

export default SavedLists;
