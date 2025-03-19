import React, { useState, useContext } from 'react';
import { List, ListItem, ListItemText, Divider, Box } from "@mui/material";
import { Home as HomeIcon, Assessment as AssessmentIcon, ListAlt as ListAltIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // Import AuthContext to access user info

const Sidebar = () => {
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
        <Box sx={{ width: "280px", backgroundColor: "#d0d7df", height: "125vh", paddingTop: "10px" }}> {/* Background color changed */}
            <List sx={{ padding: 0 }}>
                
                {/* Home */}
                <ListItem 
                    button 
                    sx={{ 
                        justifyContent: 'center', 
                        padding: "20px 0", 
                       
                        borderRadius: '5px', // Optional: add border-radius to make the edges smoother
                        margin: "5px", // Add margin between buttons
                        backgroundColor: isActive(['/app']) ? '#354a5f' : 'inherit' // Add active color effect
                    }} 
                    onClick={() => handleNavigation('/app')}
                >
                    <HomeIcon sx={{ color: isActive(['/app']) ? '#ffffff' : '#2c3e50' }} />
                </ListItem>
                <Divider sx={{ backgroundColor: "#ffffff" }} />
                
                {/* Reports */}
                <ListItem 
                    button 
                    sx={{ 
                        padding: "15px 20px", 
                        border: '2px solid #354a5f', // Increased border width to 2px
                        borderRadius: '10px', // Add more rounding to match the design
                        margin: "10px 0", // Add vertical margin between list items
                        backgroundColor: isActive(['/dashreports']) ? '#354a5f' : 'inherit' 
                    }} 
                    onClick={() => handleNavigation('/dashreports')}
                >
                    <AssessmentIcon sx={{ color: isActive(['/dashreports']) ? '#ffffff' : '#2c3e50' }} />
                    <ListItemText primary="Reports" sx={{ paddingLeft: "10px", color: isActive(['/dashreports']) ? '#ffffff' : '#2c3e50' }} />
                </ListItem>
                <Divider sx={{ backgroundColor: "#ffffff" }} />
                
                {/* Conditional buttons visible only for specific user */}
                {(user?.email === 'hashan@email.com' || user?.email === 'homitask@gmail.com')&& (
                    <>

                         {/* Work Order */}
                         <ListItem 
                            button 
                            sx={{ 
                                padding: "15px 20px", 
                                border: '2px solid #354a5f', // Increased border width to 2px
                                borderRadius: '10px', // Add more rounding to match the design
                                margin: "10px 0", // Add vertical margin between list items
                                backgroundColor: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#354a5f' : 'inherit' 
                            }} 
                            onClick={() => handleNavigation('/dashinventoryform')}
                        >
                            <ListAltIcon sx={{ color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} />
                            <ListItemText 
                                primary="Add Products" 
                                sx={{ paddingLeft: "10px", color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} 
                            />
                        </ListItem>
                        <Divider sx={{ backgroundColor: "#ffffff" }} />




















                        {/* Work Order */}
                        <ListItem 
                            button 
                            sx={{ 
                                padding: "15px 20px", 
                                border: '2px solid #354a5f', // Increased border width to 2px
                                borderRadius: '10px', // Add more rounding to match the design
                                margin: "10px 0", // Add vertical margin between list items
                                backgroundColor: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#354a5f' : 'inherit' 
                            }} 
                            onClick={() => handleNavigation('/dashgaragetable')}
                        >
                            <ListAltIcon sx={{ color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} />
                            <ListItemText 
                                primary="Garage Item" 
                                sx={{ paddingLeft: "10px", color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} 
                            />
                        </ListItem>
                        <Divider sx={{ backgroundColor: "#ffffff" }} />
                        
                       
                        {/* Work Order */}
                        <ListItem 
                            button 
                            sx={{ 
                                padding: "15px 20px", 
                                border: '2px solid #354a5f', // Increased border width to 2px
                                borderRadius: '10px', // Add more rounding to match the design
                                margin: "10px 0", // Add vertical margin between list items
                                backgroundColor: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#354a5f' : 'inherit' 
                            }} 
                            onClick={() => handleNavigation('/dashcleaningtable')}
                        >
                            <ListAltIcon sx={{ color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} />
                            <ListItemText 
                                primary="Cleaning Item" 
                                sx={{ paddingLeft: "10px", color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} 
                            />
                        </ListItem>
                        <Divider sx={{ backgroundColor: "#ffffff" }} />
                       
                        {/* Work Order */}
                        <ListItem 
                            button 
                            sx={{ 
                                padding: "15px 20px", 
                                border: '2px solid #354a5f', // Increased border width to 2px
                                borderRadius: '10px', // Add more rounding to match the design
                                margin: "10px 0", // Add vertical margin between list items
                                backgroundColor: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#354a5f' : 'inherit' 
                            }} 
                            onClick={() => handleNavigation('/dashkitchentable')}
                        >
                            <ListAltIcon sx={{ color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} />
                            <ListItemText 
                                primary="Kitchen Item" 
                                sx={{ paddingLeft: "10px", color: isActive(['/dashOrderForm', '/dashdrdertable','/dashstocklevel']) ? '#ffffff' : '#2c3e50' }} 
                            />
                        </ListItem>
                        <Divider sx={{ backgroundColor: "#ffffff" }} />
                    </>
                )}
            </List>
        </Box>
    );
};

export default Sidebar;
