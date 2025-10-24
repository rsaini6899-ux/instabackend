// const User = require('../model/user')
// const Captain = require('../model/captain')
const jwt = require('jsonwebtoken')

// module.exports.authUser = async (req, res, next) => {
//     const {authorization} = req.headers 
//     // console.log(authorization)
 
//     if(!authorization){
//         return res.status(401).json({error : "Autherization token required"})
//     }

//     const token = authorization.split(" ")[1] 
//     console.log(token)

//     try {
//         const { _id } = jwt.verify(token, process.env.SECRET)

//         console.log(_id)

//         const user = await User.findOne({ _id }).select('_id')
//         console.log(user)

//         if (!user) {
//             return res.status(401).json({ error: "Request is not authorized" })
//         }

//         req.user = user
//         next()
//     } catch (error) {
//         console.log(error);
//         res.status(401).json({ error: "Request is not " })
//     }
// }
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            throw new Error('User not authenticated');
        }
        const decode = await jwt.verify(token, process.env.SECRET);
        if (!decode) {
            throw new Error('Invalid token');
        }
        req.id = decode.userId;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).send({ error: 'Authentication failed' });
    }
};

