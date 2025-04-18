import React from "react";
import { Box, Grid } from "@mui/material";

import ShoppingTable from "./shoppingTable";
import SideB from "./sideB";
import NavB from "./NavB";




const dashShoppingTable = () => {
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
                    <ShoppingTable/>
                </Box>
            </Grid>
        </Grid>
    );
};

// Ensure the export statement matches the component name
export default dashShoppingTable;