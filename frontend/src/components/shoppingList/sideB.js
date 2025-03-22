import React, { useState, useContext } from 'react';
import { List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import { Home as HomeIcon, Assessment as AssessmentIcon, ListAlt as ListAltIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // Import AuthContext to access user info

const SideB = () => {
    const { user } = useContext(AuthContext); // Get the logged-in user
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);

    const handleNavigation = (path) => {
        setActive(path);
        navigate(path);
    };

    const isActive = (paths) => paths.includes(active);

    return (
        <Box sx={{ width: "280px",
            background:
              "linear-gradient(to bottom,rgb(21, 29, 46),rgb(115, 120, 133))", // ✅ Dark Navy Blue
            height: "125vh",
            paddingTop: "10px", }}> {/* Background color changed */}
            <List sx={{ padding: 0 }}>
                
               {/* 🏠 Home */}
        <ListItem
          button
          sx={{
            justifyContent: "center",
            padding: "20px 0",
            borderRadius: "5px",
            margin: "5px",
            backgroundColor: isActive(["/app"]) ? "rgb(97, 96, 96)" : "inherit",
            // ✅ Active State Color
            "&:hover": { backgroundColor: "#475569" }, // ✅ Hover Effect
          }}
          onClick={() => handleNavigation("/app")}
        >
          <HomeIcon sx={{ color: "#FFFFFF" }} />
        </ListItem>
        <Divider sx={{ backgroundColor: "#FFFFFF" }} />
                
                {/* Reports */}
                <ListItem 
                    button 
                    sx={{ 
                        padding: "15px 20px",
                        border: "2px solid #475569",
                        borderRadius: "10px",
                        margin: "10px 0",
                        backgroundColor: isActive(["/dashreports"])
                        ? " rgb(0, 0, 0)"
                        : "inherit",
                        "&:hover": { backgroundColor: "#475569" }, 
                    }} 
                    onClick={() => handleNavigation('/dashreports')}
                >
                   <ListAltIcon sx={{ color: "#FFFFFF" }} />
              <ListItemText
                primary="Report"
                sx={{ paddingLeft: "10px", color: "#FFFFFF" }}
              />
                </ListItem>
                <Divider sx={{ backgroundColor: "#ffffff" }} />

            
                
                {/* Conditional buttons visible only for specific user */}
                {(user?.email === 'homitask@gmail.com' || user?.email === 'first5@email.com')&& (
                    <>
                        {/* Work Order */}
                        <ListItem 
                            button 
                            sx={{ 
                                padding: "15px 20px",
                                border: "2px solid #475569",
                                borderRadius: "10px",
                                margin: "10px 0",
                                backgroundColor: isActive(["/dashShoppingForm"])
                                ? " rgb(0, 0, 0)"
                                : "inherit",
                                "&:hover": { backgroundColor: "#475569" }, 
                            }} 
                            onClick={() => handleNavigation('/dashShoppingForm')}
                        >
                            <ListAltIcon sx={{ color: "#FFFFFF" }} />
              <ListItemText
                primary="Shopping List Form"
                sx={{ paddingLeft: "10px", color: "#FFFFFF" }}
              />
                        </ListItem>
                        <Divider sx={{ backgroundColor: "#ffffff" }} />
                        
                      
                        
                       
                      
                    </>
                )}
            </List>
        </Box>
    );
};

export default SideB;
