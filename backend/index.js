const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connection Success!");
});

//Hashan

const testRouter5 = require("./routes/login/test5.js");
app.use("/test5", testRouter5);


const testRouter = require("./routes/test/rtest.js");
app.use("/test", testRouter);






//nishitha
const inventoryRoutes = require("./routes/inventoryHandling/inventoryRoutes.js");
const removeInventoryRoutes = require("./routes/inventoryHandling/removeInventoryRoute.js"); // Import removeInventoryRoutes

app.use("/api/inventory", inventoryRoutes);
app.use("/api/removeinventory", removeInventoryRoutes); // Remove inventory routes


//tashini


//Nishan



app.listen(PORT, () => {
  console.log(`Server is up and running on PORT : ${PORT}`);
});
