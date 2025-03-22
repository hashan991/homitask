import React from "react";
import { Box, Grid } from "@mui/material";


import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import GarageTable from "./GarageTable";

const DashGarageTable = () => {
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
                    <GarageTable />
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashGarageTable;
