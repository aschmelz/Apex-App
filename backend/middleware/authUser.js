const jwt = require("jsonwebtoken");
const SECRET_KEY = require("dotenv").config();

module.exports = (req, res, next) => {
    const authHeader = req.header("authorization");
    //console.log(req);
    //console.log(authHeader);

    if (authHeader) {
        try {
            const authArray = authHeader.split(" ");
            //console.log(authArray);
            if (authArray[0].toLowerCase() == "bearer") {
                const token = authArray[1];
                const payLoad = jwt.verify(token, SECRET_KEY.parsed.SECRET_KEY);               // if success => verify will return original payLoad from user.js routes FindOne()
                req.user = payLoad;
                next();
            } else {
                res.status(401).send("Access denied: Authorization type not supported!");
            }
        } catch (error) {                                               // if incorrect token is passed
            res.status(401).send("Error: Access Denied");
        }
    } else {                                                            // if no authorization token is sent
        res.status(401).send("No authorization header provided!");
    }
}