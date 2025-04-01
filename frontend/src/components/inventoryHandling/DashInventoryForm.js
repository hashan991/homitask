import React from "react";
import { Box, Grid } from "@mui/material";

import InventoryForm from "./InventoryForm";
import Sidebar from "./SideBar";
import Navbar from "./NavBar";

const DashInventoryForm = () => {
    return (
        <Grid container>
            <Grid item>
                <Sidebar />
            </Grid>
            <Grid item xs>
                <Navbar />
                <Box 
                    sx={{ 
                        padding: "0px", 
                        backgroundColor: "#e0e0e0", 
                        minHeight: "100vh" 
                    }}
                >
                    <InventoryForm />
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashInventoryForm;
