const mongoose = require("mongoose");
const User = require("../models/users");
const Product = require("../models/products")

// Create Invoice Schema
const invoiceSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    companyAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    created: { type: Date, default: Date.now },
    items: [],
    invoiceNumber: { type: String }
})

module.exports = mongoose.model("Invoice", invoiceSchema);