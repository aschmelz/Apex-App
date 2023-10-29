const mongoose = require("mongoose");
const Product = require("../models/products.js")


// Create User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true,
        index: { // mongoose only does this if collection DNE yet
            unique: true,
            collation: { locale: "en", strenght: 2 }
            },
        match:  /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/ // use regex101.com --> Regex Library
    },
    password: { type: String, required: true, match: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/ },
    created: { type: Date, default: Date.now },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"],
        default: "user"
    },
    cart: [ Product.modelName ], // store items in the cart
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: true },
    companyAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true }
})

module.exports = mongoose.model("User", userSchema);