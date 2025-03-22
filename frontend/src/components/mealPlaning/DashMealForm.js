import React, { useState } from "react";
import { Box, Grid } from "@mui/material";

import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import MealForm from "./MealForm";



const DashMealForm = () => {
    return (
        <Grid container>
            <Grid item>
                <Sidebar />
            </Grid>
            <Grid item xs>
                <Navbar />
                <Box 
                    sx={{ 
                        padding: "20px", 
                        backgroundColor: "#e0e0e0", 
                        minHeight: "100vh" 
                    }}
                >
                    <MealForm />
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashMealForm;
