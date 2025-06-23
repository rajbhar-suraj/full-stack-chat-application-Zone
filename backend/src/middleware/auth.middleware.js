import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// needs to perform operation which are critical hence need to verify if the user is valid or not
export const protectedRoute = async (req, res, next) => {

    try {
        //1 fetch token jwt- is the name of the token which you set
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({ message: "Unauthorized - No Token Provided" })

        //2 will decode it by using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //why we are getting the id from this refer generate token jwt.sign

        if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid Token" })

        //3 will check if that token is of that user or not also userId is there because while generating token we have set there userId
        const user = await User.findById(decoded.userId).select("-password")

        // By setting req.user = user, you're storing that user data on the request object.
        // This way, in any next route handler, you can access req.user directly without having to decode the token or query the database again.
        
        if (!user) return res.status(404).json({ message: "User not found" })
        req.user = user
    
        next()

    } catch (error) {
        console.log('❌ protectedRoute error:', error);
        console.log("Error in middleware", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

