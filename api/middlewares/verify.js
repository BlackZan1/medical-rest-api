const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authVerify = async (req, res, next) => {
    try {
        if(req.method === 'OPTIONS') {
            return next();
        }

        const authHeader = req.get('Authorization');

        if(authHeader.split(' ')[0] !== 'Bearer') {
            req.userId = null;

            return next();
        }

        const token = authHeader.split(' ')[1];

        console.log(token);

        if(!token) {
            req.userId = null;

            return next();
        }

        const tokenData = jwt.verify(token, JWT_SECRET);

        console.log(tokenData);
        
        req.userId = tokenData.userId;

        next();
    }
    catch(err) {
        console.log(err.name);

        if(err.name === 'TokenExpiredError') {
            return res.json({
                token: { 
                    message: err.message, 
                    name: err.name, 
                    expiredAt: err.expiredAt 
                }
            })
        }

        res.status(401).json({
            error: { message: err }
        })
    }
}

module.exports = authVerify;