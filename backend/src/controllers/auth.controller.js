import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../lib/utils.js';


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" })

        if (password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters" })

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "User already exists" })

        //bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashed
        })

        if (newUser) {
            const userId = newUser._id;
            //generating token
            generateToken(userId, res)

            await newUser.save()
            return res.status(201).json({
                _id: userId,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ message: "All fields are required" })

        if (password.length < 6) return res.status(400).json({ message: "Password must be atleast 6 characters" })

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" })

        const isCorrect = await bcrypt.compare(password, user.password)
        if (!isCorrect) return res.status(400).json({ message: "Invalid credentials" })

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

// to upload the image in cloudinary and storing in database -- please do the revision
export const updateProfile = async (req, res) => {

    try {
        //1 fetching the image 
        const profilePic = req.file.path; // this is Cloudinary URL
        //2 this is protected route req.user = user this is being passed from there and we are using it
        const userId = req.user._id

        // if (!profilePic) return res.status(400).json({ message: "Profile pic is required" })
        //3 uploading in cloudinary
        // const uploadResponse = await cloudinary.uploader.upload(profilePic)
        //4 update in database
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic }, { new: true })

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("Error in updateProfile", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}
