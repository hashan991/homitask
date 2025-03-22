import React from "react";
import { Box, Grid } from "@mui/material";

import MealTable from "./MealTable";
import Sidebar from "./SideBar";
import Navbar from "./NavBar";

const DashMealTable = () => {
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
                    <MealTable/>
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashMealTable;
