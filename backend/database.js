const mongoose = require("mongoose");                       // npm install mongoose/mongodb

// Connect to MongoDB
const mongoURI = "mongodb+srv://apexSupply:wBtvRcHbuSIX4LW3@apex-supply-co.8pnaaoa.mongodb.net/apexProducts?retryWrites=true&w=majority";
mongoose.exports = connectToMongo = async () => {           // export db connection to index.js
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.log(error);
    }
}

connectToMongo();