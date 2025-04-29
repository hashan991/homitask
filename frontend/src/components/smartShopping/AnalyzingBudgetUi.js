import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const messages = [
  "🔄 Analyzing your budget...",
  "💰 Finding the best meal deals...",
  "🥗 Optimizing meals for nutrition...",
  "🛒 Calculating cost-effective groceries...",
  "✅ Finalizing your personalized meal plan...",
];

const AnalyzingBudget = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < messages.length) {
          setCurrentMessage(messages[nextIndex]);
          return nextIndex;
        } else {
          return prevIndex; // Stay on last message
        }
      });
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          p: 4,
          width: "100%",
          maxWidth: "600px",
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.2)",
          position: "relative",
        }}
      >
        {/* 🔄 Pulsating Loader Animation */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <CircularProgress
            color="primary"
            size={70}
            sx={{
              mb: 2,
              animation: "spin 1.5s linear infinite",
              filter: "drop-shadow(0px 0px 10px rgba(0, 102, 255, 0.6))",
            }}
          />
        </motion.div>

        {/* 🔹 Step-by-Step Analyzing Messages */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor: "rgba(0, 102, 255, 0.3)",
            boxShadow: "0px 0px 15px rgba(0,102,255,0.4)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              color: "rgba(255,255,255,0.9)",
              textShadow: "0px 2px 5px rgba(0,0,0,0.4)",
            }}
          >
            {currentMessage}
          </Typography>
        </motion.div>

        {/* 👇 Subtext with Typewriter-Like Effect */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Typography variant="body2" color="gray" mt={2}>
            Please wait while we calculate the best meal plan for you. 🍽️
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default AnalyzingBudget;
