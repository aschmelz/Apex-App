// Create constants for express/mongoose
const express = require("express");                         // npm install express
const mongoose = require("mongoose");
const database = require("./database.js");                  // connect to database.js for db connection
const cors = require("cors");                               // npm install cors --> connect Express local3000 and Angular local4200
                                                            // npm install nodemon
                                                            // Follow https://material.angular.io/guide/getting-started for material UI

// Routing
const productRoutes = require("./routes/products.js");       
const userRoutes = require("./routes/users.js");
const cartRoutes = require("./routes/cart.js");

// Middleware
const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
}));
app.use(express.json());
app.use("/", productRoutes);
app.use("/users", userRoutes);
app.use("/users/cart", cartRoutes);

app.listen(3000, () => {
    console.log("Connected to localhost3000 <^_^>");
})