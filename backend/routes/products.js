const express = require("express");
const Product = require("../models/products.js");
const router = express.Router();
const authUser = require("../middleware/authUser.js");


// CRUD Operations
router.get("/", (req, res) => {
    Product.find().then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
});

// For search
router.get("/searchTerm", (req, res) => {    
        
    if (req.query.filter) {
        req.query.filter = JSON.parse(req.query.filter);
    }
    //console.log(req.query);
    Product.find({
        '$or': [
        { 'name': { '$regex': req.query.filter.name, '$options': 'i' } },
        { 'brand': { '$regex': req.query.filter.name, '$options': 'i' } }]
    })
    .then(function(result, err) {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    });
});

// To get a product using its id
router.get("/:id", (req, res) => {
    Product.findById(req.params.id).then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
});

// To add a product
router.post("/", authUser, (req, res) => {
    let newProduct = new Product(req.body);
    newProduct.save().then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
});

// To update a product
router.put("/:id", authUser, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).then((result, err) => {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
});

// To delete a product by its id
router.delete("/:id", authUser, (req, res) => {
    Product.findByIdAndDelete(req.params.id).then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
});

module.exports = router;