import User from "../models/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { streamUser } from "../lib/stream.js";

export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(500).json({ message: "all fields are required" });
        }
        if (password.length < 6) {
            return res.status(500).json({ message: "password length should be >6" });
        }

        const Regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!Regex.test(email)) {
            return res.status(500).json({ message: "invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(500).json({ message: "User already Exist" });
        }

        const n = Math.floor(Math.random() * 100) + 1;
        const avatar = `https://avatar.iran.liara.run/public/${n}.png`;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            profilePic: avatar
        })

        try {
            await streamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log("streamUser Created");
        } catch (error) {
            console.log("error creating streamUser", error)
        }

        const token = jwt.sign({
            userID: newUser._id
        }, process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            })

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "strict",
        })
        res.status(200).json({ message: "Signup Successfull", user: newUser })
    } catch (error) {
        console.log("error in signup");
        res.status(500).json({ message: error })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "enter details to login" })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({
            userID: user._id
        }, process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            })

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "strict",
        })

        res.status(200).json({ message: "login successfull", user: user });
    } catch (error) {
        console.log("error in login", error);
        res.status(500).json({ message: "Error in login" });
    }
}

export async function logout() {
    res.clearCookie("jwt");
    return res.status(200).json({ success: true, message: "logout successfull" })

}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, location } = req.body;

        if (!bio || !fullName || !location) {
            return res.status(400).json({
                message: "fill all details before onboarding",
                missingfields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !location && "location"
                ].filter(Boolean)
            })
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true })

        if (!updatedUser) {
            return res.status(400).json({ message: "user Not Found" })
        }

        try {
            await streamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic
            })
            console.log("stream User updated after onboarding", updatedUser.fullName)
        } catch (error) {
            console.log("error while updating stream user", error)
        }
        res.status(200).json({ message: "details updates successfully", user: updatedUser })
    } catch (error) {
        console.log("error in onboarding");
        res.status(500).json({ message: "error in onboarding" })
    }
}