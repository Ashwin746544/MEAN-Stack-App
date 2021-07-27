const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log("inside try bleck");
        const token = req.headers.authorization.split(" ")[1]; //here for getting header we always  must have to use lowercase like req.headers.authorization however we set header in uppercase like re.header.set("Authorization","Bearer "+ authToken)
        console.log("token fetched successfully");
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { email: decoded.email, userId: decoded.userId };
        next();

    } catch (error) {
        res.status(401).json({
            message: "You Are not Authenticated!"
        });
    }
}