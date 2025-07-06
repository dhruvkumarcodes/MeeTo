import jwt from "jsonwebtoken"
import User from "../models/User.js"

export async function protectRoute(req, res, next) {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "no token valid" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return req.status(400).json({ message: "invalid token" })
        }

        const user = await User.findById(decoded.userID).select("-password");

        if (!user) {
            return res.status(400).json({ message: "unauthorized user not found" })
        }

        req.user = user;
        next()

    } catch (error) {
        console.log("error in protectRoute middleware", error)
        res.status(500).json({ message: "Internal Server error" })
    }
}