const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const Product = require("../models/products.js");
const jwt = require("jsonwebtoken");
const authUser = require("../middleware/authUser.js");

// Function to break up cart prop into its individual items
function updateCart(cart) {
    let modCart = [];
    //console.log(cart);

    for (let i = 0; i < cart.length; i++) {
        let newCount = cart[i]['count'];                                // cart[i]['count'] refer to name prop of i item in cart and check its count val
        //console.log(newCount);
        delete cart[i]['count'];                                        // Need to remove the count prop
        for (let j = 0; j < newCount; j++) {
            modCart.push(cart[i]);
            //console.log(modCart);
        }
    }
    //console.log(modCart);                                             // shows individual items even if duplicated
    return modCart;
}

router.post("/:id", authUser, async (req, res) => {
    //console.log(req.body);
    const user = req.user;                                              // entire object of person
    try {
        let cartToUpdate = updateCart(req.body);
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { cart: cartToUpdate }
        )
        //console.log(updatedUser);
        res.status(201).send(updatedUser);
    } catch (error) {
        //console.log(error);
        res.status(500).send("BAD");
    }
})

router.put("/:id", authUser, async (req, res) => {
    let newProduct = new Product(req.body);
    const user = req.user;
    //console.log(user._id);
    try {
        if (user._id) {
            const index = user._id.cart.findIndex(product => product._id === newProduct._id);
            if (index !== -1) {
                const updatedUser = await User.findByIdAndUpdate(
                    user._id,
                    {
                        $slice: {
                            cart: {
                                start: index, end: index + 1
                            }
                        }
                    }
                );
                //console.log(updatedUser);
                res.status(201).send(" DELETED:D")
            } else {
                res.status(400).send("Product not found in cart");
            }
        } else {
            res.status(400).send("User does not have a cart");
        }
    } catch {
        res.status(500).send("NOT DELETED!");
    }
})

router.get("/:id", authUser, (req, res) => {
    User.findById(req.params.id).then((result, err) => {
        if (!err) {
            let nameCounts = {};
            //console.log(result);
            let cart = result.cart;

            for (let i = 0; i < cart.length; i++) {
                //console.log(i);
                if (cart[i].name in nameCounts) {               // if already exists in nameCounts
                    //console.log(cart[i].name);
                    nameCounts[cart[i].name]['count'] = nameCounts[cart[i].name]['count'] + 1;  // make dictionary. nameCounts[cart[i].name] refers to item name, ['count'] adds new prop
                } else {
                    //console.log("ELSE PART");
                    //console.log(cart[i].name);
                    nameCounts[cart[i].name] = {
                        "name":  cart[i].name,
                        "price": cart[i].price,
                        "brand": cart[i].brand,
                        "count": 1
                    }
                }
            }
            result.cart = Object.values(nameCounts);            // result is entire user's data. change just the cart prop to simplified version
            //console.log(nameCounts);
            //console.log(result.cart);
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
})

module.exports = router;