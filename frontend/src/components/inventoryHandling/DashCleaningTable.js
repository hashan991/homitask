import React from "react";
import { Box, Grid } from "@mui/material";


import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import CleaningTable from "./CleaningTable";

const DashCleaningTable = () => {
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
                    <CleaningTable />
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashCleaningTable;
