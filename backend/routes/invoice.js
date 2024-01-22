const Invoice = require("../models/invoice");
const User = require("../models/users.js")
const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authUser.js")

// Sort the invoice numbers => need most recent invoiceNumber then increment the value in frontend
router.get("/getInvoices", (req, res) => {
    Invoice.find({}).sort({ "invoiceNumber": -1 }).then((result, err) => {
        if (!err) {
            res.status(200).send(result[0]);
        } else {
            res.status(400).send(result);
        }
    })
})

router.get("/getInvoices/:id", authUser, (req, res) => {
    User.findById(req.params.id).then((result, err) => {
        //console.log(result.cart);
        if (!err) {
            let nameCounts = {};
            let cart = result.cart;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].name in nameCounts) {
                    nameCounts[cart[i].name]['count'] = nameCounts[cart[i].name]['count'] + 1;
                } else {
                    nameCounts[cart[i].name] = {
                        "name":  cart[i].name,
                        "price": cart[i].price,
                        "brand": cart[i].brand,
                        "count": 1
                    }
                }
            }
            result.cart = Object.values(nameCounts);
            res.status(200).send(result.cart);
        } else {
            res.status(400).send(err);
        }
    })
})

router.post("/createInvoice", authUser, (req, res) => {
    let newInvoice = new Invoice(req.body);
    newInvoice.save().then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })  
})

module.exports = router;