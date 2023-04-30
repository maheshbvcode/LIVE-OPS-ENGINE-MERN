const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

const fetchUser = async (req, res, next)=>{

    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({
            status: 'failure',
            message: 'Access denied'
        })
    }
    try{
        // console.log(jwt_secret)
        const user = jwt.verify(token, jwt_secret)
        // console.log(user);
        req.user = user.data
        next();
    }catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
}

module.exports = fetchUser;