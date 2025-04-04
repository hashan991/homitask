import React from "react";
import { Box, Grid } from "@mui/material";

import Sidebar from "./SideBar";
import Navbar from "./NavBar";
import BudgetPlanner from "./BudgetPlanner";
import SavedLists from "./SavedLists";

const DashSavedList = () => {
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
            minHeight: "100vh",
          }}
        >
          <SavedLists />
        </Box>
      </Grid>
    </Grid>
  );
};

// Ensure the export statement matches the component name
export default DashSavedList;
