import React from "react";
import { Box, Grid } from "@mui/material";

import dashreports from "./dashreports";
import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import MealReport from "./dashreports";


const DashMealReport = () => {
    return (
        <Grid container>
            <Grid item>
                <Sidebar/>
            </Grid>
            <Grid item xs>
                <Navbar/>
                <Box 
                    sx={{ 
                        padding: "20px", 
                        backgroundColor: "#e0e0e0", 
                        minHeight: "100vh" 
                    }}
                >
                    <MealReport/>
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashMealReport;
