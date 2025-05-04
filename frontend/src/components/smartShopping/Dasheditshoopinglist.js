import React from "react";
import { Box, Grid } from "@mui/material";

import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import EditShoppingList from "./EditShoppingList";

const Dasheditshoopinglist = () => {
  return (
    <Grid container>
      <Grid item>
        <Sidebar />
      </Grid>
      <Grid item xs>
        <Navbar />
        <Box
          sx={{
            
            backgroundColor: "#e0e0e0",
            minHeight: "100vh",
          }}
        >
          <EditShoppingList />
        </Box>
      </Grid>
    </Grid>
  );
};

// Ensure the export statement matches the component name
export default Dasheditshoopinglist;
