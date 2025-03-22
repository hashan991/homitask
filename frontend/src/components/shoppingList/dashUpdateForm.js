import React from "react";
import { Box, Grid } from "@mui/material";

import UpdateForm from "./updateForm";
import SideB from "./sideB";
import NavB from "./NavB";




const dashUpdateForm = () => {
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
                    <UpdateForm/>
                </Box>
            </Grid>
        </Grid>
    );
};

// Ensure the export statement matches the component name
export default dashUpdateForm;