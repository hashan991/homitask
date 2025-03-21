import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

const BudgetInput = ({ onBudgetSubmit }) => {
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    // Prevent non-numeric values
    if (!/^\d*$/.test(value)) {
      return;
    }

    setBudget(value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedBudget = Number(budget.trim());

    if (!budget || isNaN(parsedBudget) || parsedBudget <= 0) {
      setError("⚠ Budget must be a positive whole number!");
      return;
    }

    setError(""); // Clear error if valid
    onBudgetSubmit(parsedBudget);
    setBudget(""); // Reset input
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          maxWidth: 450,
          margin: "auto",
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          💰 Set Your Budget
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter Budget"
            variant="outlined"
            fullWidth
            value={budget}
            onChange={handleChange}
            error={!!error}
            helperText={error || ""}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "1rem",
              },
            }}
          />

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={!budget || !!error}
              sx={{
                padding: "12px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "12px",
                textTransform: "uppercase",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#0069d9",
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                },
                "&:disabled": {
                  backgroundColor: "#b0b0b0",
                  color: "#ffffff",
                  cursor: "not-allowed",
                },
              }}
            >
              🚀 Set Budget
            </Button>
          </motion.div>
        </form>
      </Paper>
    </motion.div>
  );
};

export default BudgetInput;
