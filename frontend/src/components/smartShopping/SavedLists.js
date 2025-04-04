import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SavedLists = () => {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8070/api/shopping-list/all"
        );
        setLists(res.data);
      } catch (err) {
        console.error("Error fetching saved lists", err);
      }
    };

    fetchLists();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📚 Saved Shopping Lists
      </Typography>

      {lists.length === 0 ? (
        <Typography>No saved lists found.</Typography>
      ) : (
        <List>
          {lists.map((list) => (
            <Paper key={list._id} sx={{ mb: 2, p: 2 }}>
              <ListItem
                secondaryAction={
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/view-list", { state: { list } })}
                  >
                    View List
                  </Button>
                }
              >
                <ListItemText
                  primary={list.name}
                  secondary={`📅 ${new Date(list.date).toLocaleDateString()}`}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Container>
  );
};

export default SavedLists;
