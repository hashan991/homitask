import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PRIImage from "../../images/PRI.jpg";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [plans, setPlans] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [upcomingPlans, setUpcomingPlans] = useState([]);
  const open = Boolean(anchorEl);

  // Fetch plans
  const fetchPlans = async () => {
    try {
      const response = await fetch("http://localhost:8070/test2/plan");
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        console.error("Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const upcoming = plans.filter((plan) => {
        const planStartTime = parseDateAndTime(plan.psdate, plan.pstime);
        return (
          planStartTime > now &&
          planStartTime <= new Date(now.getTime() + 60000)
        );
      });

      setNotificationCount(upcoming.length);
      setUpcomingPlans(upcoming);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [plans]);

  const parseDateAndTime = (date, time) => {
    const [year, month, day] = date
      .split("-")
      .map((part) => parseInt(part, 10));
    const [hours, minutes] = time.split(":").map((part) => parseInt(part, 10));
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Handle notification menu
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background:  "linear-gradient(to right,rgb(21, 29, 46),rgb(115, 120, 133))",// ✅ Smooth gradient mix
        color: "#FFFFFF",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
        borderRadius: "0px",
        padding: "5px 15px",
      }}
    >
      <Toolbar>
        {/* LOGO / TITLE */}
        <Box sx={{ flexGrow: 1, zIndex: 10 }}>
          {" "}
          {/* ✅ Ensured text is above gradient */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: "20px",
              marginLeft: "3px",
              color: "#FFFFFF",
              textShadow: "2px 2px 10px rgba(255, 255, 255, 0.2)", // ✅ Subtle glow
            }}
          >
            HOMITASK
          </Typography>
        </Box>

        

        {/* 👤 User Avatar */}
        <Avatar
          alt="User"
          src={PRIImage}
          sx={{
            marginLeft: 2,
            width: 50,
            height: 50,
            border: "2px solid #ffffff",
            boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.3)", // ✅ Outer Glow
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)", // ✅ Slight Zoom on Hover
            },
          }}
        />

        {/* 📜 Notification Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 400,
              width: "300px",
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              borderRadius: "10px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          {upcomingPlans.length === 0 ? (
            <MenuItem
              onClick={handleClose}
              sx={{
                color: "#FFFFFF",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              No upcoming plans
            </MenuItem>
          ) : (
            upcomingPlans.map((plan) => (
              <MenuItem key={plan._id} onClick={handleClose}>
                <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                  <strong>📌 Work Name:</strong> {plan.pnum}
                  <br />
                  <strong>⏰ Start Time:</strong> {plan.pstime}
                  <br />
                  <strong>👥 Team:</strong> {plan.pteam}
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
