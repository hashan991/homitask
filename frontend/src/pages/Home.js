import React from 'react';
//import { Box ,Typography,Grid,CardMedia,List, ListItem, ListItemIcon, ListItemText} from '@mui/material';

import Main from './Main';
import Footer from './Footer';
import Sidebar2 from './Sidebar2';



import img1 from '../images/inventory_rubber_mats.jpeg';
import img2 from '../images/gym_rubber_flooring.jpeg';
import img3 from '../images/rubber_runner_mats.jpeg';
import img4 from '../images/rubber_playground_mats.jpeg';
import img5 from '../images/commercial_flooring.jpeg';
import img6 from '../images/rubber_carpet_tile.jpeg';
import myImage from '../images/myImage.png';
import locationMap from '../images/location-map.png';




//import { Facebook, Twitter, Instagram, Search, Phone, Email, LocationOn, ArrowBack, ArrowForward, AddShoppingCart, Mail, AccessTime, LinkedIn, Pinterest } from '@mui/icons-material';
import { AppBar, Toolbar, IconButton, Typography, Button, TextField, Container, Box, Grid, Card, CardContent, CardMedia, List, ListItem, ListItemIcon, ListItemText, Link } from '@mui/material';
import { Facebook, Twitter, Instagram, Search, Phone, Email, LocationOn, ArrowBack, ArrowForward, AddShoppingCart, Mail, AccessTime, LinkedIn, Pinterest } from '@mui/icons-material';
import UNavbar from './UNavbar';

const products = [
  { id: 1, name: 'Inventory rubber mats', price: '400LKR', image: img1, description: '' },
  { id: 2, name: 'Gym rubber flooring', price: '1,333LKR', image: img2, description: ''  },
  { id: 3, name:'Rubber runner mats', price: '860LKR', image: img3, description: '' },
  { id: 4, name: 'Rubber playground mats', price: '500LKR', image: img4, description: '' },
  { id: 5, name:'Commercial flooring', price: '600LKR', image: img5, description:  ''},
  { id: 6, name: 'Rubber carpet tile', price: '550LKR', image: img6, description: '' },
];




const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden", // Ensures the background image doesn't overflow
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Places the background image behind other content

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <UNavbar />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar2 />
        <Box component="main" sx={{ flex: 1, padding: 0 }}>
          <Main />
        </Box>
      </Box>

      {/* Products Section 
     <Box py={6} id="features" sx={{ backgroundColor: "#f0f4f8" }}>
  <Typography
    variant="h4"
    align="center"
    fontWeight="bold"
    sx={{ mb: 4, color: "#1E293B" }}
  >
    🏡 Smart Home Features
  </Typography>

  <Grid container spacing={4} justifyContent="center">
    {modules.map((module) => (
      <Grid item key={module.id} xs={12} sm={6} md={4}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            background: "#ffffff",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.08)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <Box
            component="img"
            src={module.icon}
            alt={module.name}
            sx={{ height: 60, mb: 2 }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {module.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {module.description}
          </Typography>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>


     

      {/* Contact Us Section */}
      <Box py={5} px={3} bgcolor="#f9f9f9" id="contact-us">
        <Typography variant="h4" align="center" gutterBottom>
          CONTACT US
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {/* Left Side - Map */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              alt="Location Map"
              image={locationMap}
              sx={{
                borderRadius: "10px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Grid>
          {/* Right Side - Contact Information */}
          <Grid item xs={12} md={6}>
            <List>
              {/* Address */}
              <ListItem>
                <ListItemIcon>
                  <LocationOn fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Our Office Address"
                  secondary="PRI  (Pvt) Ltd. 123, Industrial Zone, Colombo 05,Colombo,,00500,Sri Lanka"
                />
              </ListItem>
              {/* Email */}
              <ListItem>
                <ListItemIcon>
                  <Mail fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="General Enquiries"
                  secondary="prirubber@email.com"
                />
              </ListItem>
              {/* Phone */}
              <ListItem>
                <ListItemIcon>
                  <Phone fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Call Us" secondary="+94-78 111 1111" />
              </ListItem>
              {/* Office Hours */}
              <ListItem>
                <ListItemIcon>
                  <AccessTime fontSize="large" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Our Timing"
                  secondary="Mon - Sun: 10:00 AM - 07:00 PM"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      {/* About Us Section */}
      <Box py={5} px={3} bgcolor="#f9f9f9" id="about-us">
        <Grid container alignItems="center" justifyContent="center">
          {/* Left Image Section */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              alt="Decorative Image"
              height="400"
              image={myImage}
              sx={{
                borderRadius: "10px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Grid>
          {/* Right Text Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              paddingLeft: { xs: "0", md: "30px" },
              marginTop: { xs: "20px", md: "0" },
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              ABOUT US
            </Typography>
            <Typography variant="body1" color="textSecondary">
              HomiTask At HomiTask, we specialize in providing an intelligent
              and efficient home task management solution designed to streamline
              household organization.{" "}
            </Typography>
            <Typography variant="body1" color="textSecondary" mt={2}>
              Our platform simplifies wishlist tracking, shopping list
              management, meal planning, and inventory monitoring, ensuring that
              every task is handled effortlessly. With a focus on automation,
              smart notifications, and AI-driven insights, we are committed to
              enhancing productivity, reducing stress, and bringing convenience
              to everyday home management. Our dedicated team ensures that every
              feature is optimized for ease of use, performance, and
              reliability, making HomiTask the perfect assistant for modern
              households.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
