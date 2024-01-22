// Create constants for express/mongoose
const express = require("express");                         // npm install express
const mongoose = require("mongoose");
const database = require("./database.js");                  // connect to database.js for db connection
const cors = require("cors");                               // npm install cors --> connect Express local3000 and Angular local4200
                                                            // npm install nodemon
                                                            // Follow https://material.angular.io/guide/getting-started for material UI

/*
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 535,
    secure: true,
    auth: {
        user: "aes32@yahoo.com",
        pass: "7925010aS"
    }
});

async function main() {
    const info = await transporter.sendMail({
        from: "aes32@yahoo.com",
        to: "schmelz.amir@gmail.com",
        subject: "WOOP",
        text: "Fuck yeah!"
    })
}
main();
*/

// Routing
const productRoutes = require("./routes/products.js");       
const userRoutes = require("./routes/users.js");
const cartRoutes = require("./routes/cart.js");
const invoiceRoutes = require("./routes/invoice.js");

// Middleware
const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
}));
app.use(express.json());
app.use("/", productRoutes);
app.use("/users", userRoutes);
app.use("/users/cart", cartRoutes);
app.use("/invoice", invoiceRoutes);

app.listen(3000, () => {
    console.log("Connected to localhost3000 <^_^>");
})