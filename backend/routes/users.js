const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const router = express.Router();
const jwt = require("jsonwebtoken");                                                // npm install jsonwebtoken

const saltRounds = 10;
const { body, validationResult } = require('express-validator');
const SECRET_KEY = require("dotenv").config();
//console.log(SECRET_KEY);

// Want the api to be .get("/"). Doesn't work, but works with /users
// To GET list of users
router.get("/get", (req, res) => {
    User.find({}).then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
});

// To GET a user by its id
router.get("/get/:id", (req, res) => {
    User.findById(req.params.id).then((result, err) => {
        if (!err) {
            res.status(200).send(result);
        } else {
            res.status(400).send(err);
        }
    })
})

// To ADD a user
router.post("/register", (req, res) => {
    User.findOne({ email: req.body.email }).then((result, err) => {
        if (!err) {
            if (!result) {                                                                  // result is the email from findOne
                let newUser = new User(req.body);

                // Password validation
                const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/; // Example regex: At least 1 digit and 1 letter, minimum length 8
                const password = req.body.password;
                if (!password.match(passwordRegex)) {
                    return res.status(400).send('Password does not meet requirements');
                }

                newUser.password = bcrypt.hashSync(newUser.password, saltRounds);           // password encryption
                newUser.save().then((result, err) => {
                    if (!err) {
                        res.status(201).send(result);
                    } else {
                        res.status(404).send(err);
                    }
                })
            } else {
                res.status(400).send("User already exists!");                               // if email is the same
            }
        }
    })
});


router.post("/login", async (req, res) => {
    User.findOne({ email: req.body.email }).then((result, err) => {
        //console.log(result);
        if (!err) {
            if (result) {                                                                   // if user is found
                bcrypt.compare(req.body.password, result.password, (err2, bcresult) => {    // compare the user input password with the result.password in mongodb
                    if (bcresult) {                                                         // bcresult = if result then compare the bcrypt of the password from req.body with password in mongo
                        let payLoad = {
                            _id: result._id,                                                // payLoad will have the id from mongodb
                            role: result.role,                                              // payLoad will have the role from mongodb
                            email: result.email,                                            // payLoad will have the email from mongodb
                            firstName: result.firstName,
                            lastName: result.lastName,
                            companyName: result.companyName,
                            companyAddress: result.companyAddress,
                            phoneNumber: result.phoneNumber
                        };
                        //console.log(payLoad);
                        //let token = jwt.sign(payLoad, SECRET_KEY.parsed.SECRET_KEY);        // sign this private key to the payword and store as token
                        //console.log(SECRET_KEY.parsed.SECRET_KEY);
                        let token = jwt.sign(payLoad, SECRET_KEY.parsed.SECRET_KEY);
                        res.status(200).send({ jwt: token,                                    // Send the token && email && role && _id
                            _id: payLoad._id,
                            role: payLoad.role,
                            email: payLoad.email,
                            firstName: payLoad.firstName,
                            lastName: payLoad.lastName,
                            companyName: payLoad.companyName,
                            companyAddress: payLoad.companyAddress,
                            phoneNumber: payLoad.phoneNumber
                        });           
                    } else {
                        res.status(400).send("IF CLIENT INPUTS WRONG PASSWORD!");
                    }
                })   
            } else {
                res.status(400).send("IF CLIENT INPUTS WRONG EMAIL!");
            }  
        } else {
            res.status(400).send("SOMETHING WENT WRONG! PLEASE TRY AGAIN");
        }
    })
});

// To UPDATE a user by its id
router.put("/get/:id", (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {
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

// To DELETE a user by its id
router.delete("/get/:id", async (req, res) => {
    let userDelete = await User.findByIdAndDelete(req.params.id);
    try {
        res.status(200).send(userDelete);
        //console.log("Deleted");
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;