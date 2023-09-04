const mongoose = require("mongoose");

// Create Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: false },
    count: { type: Number }
})

module.exports = mongoose.model("Product", productSchema);