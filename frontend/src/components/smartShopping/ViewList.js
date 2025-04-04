import React from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ViewList = () => {
  const location = useLocation();
  const { list } = location.state || {};

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🛒 {list.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        📅 {new Date(list.date).toLocaleDateString()}
      </Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        <List dense>
          {list.items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.name} - ${item.quantity} ${item.unit}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ViewList;
