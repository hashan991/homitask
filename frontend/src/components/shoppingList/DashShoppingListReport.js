import React from "react";
import { Box, Grid } from "@mui/material";


import DashShoppingReport from "./dashshoppingreport";
import SideB from './sideB';
import NavB from './NavB';



const DashShoppingListReport = () => {
    return (
        <Grid container>
            <Grid item>
                <SideB/>
            </Grid>
            <Grid item xs>
                <NavB/>
                <Box 
                    sx={{ 
                        padding: "20px", 
                        backgroundColor: "#e0e0e0", 
                        minHeight: "100vh" 
                    }}
                >
                    <DashShoppingReport/>
                </Box>
            </Grid>
        </Grid>
    );
};

export default DashShoppingListReport;
