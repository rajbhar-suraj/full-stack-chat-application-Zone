import User from "../models/user.model.js";
import Message from '../models/message.model.js';
import cloudinary, { upload } from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        //doing this cause we don't want our name on side bar 
        const loggedInUser = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUser } }).select("-password") // $ne : exclude loggedInUser //ne: not equal and removing the password

        res.status(200).json(filteredUser)
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id; //getting from protected route //logged in user

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId }, //this one is user while sending the messages
                { senderId: userToChatId, receiverId: myId }  // this one is also user while receiving the messages
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body
        const senderId = req.user._id //my id getting from protected route
        const receiverId = req.params

        const imageUrl = req.file ? req.file.path : null

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();

        //todo: socket 
        const receiveObj = Object.create(receiverId)
        //checking if the user is online if yes then send message to user specifically
        const receiverSocketId = getRecieverSocketId(receiveObj.id)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessages", newMessage)
        }

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal server errro" })
    }
}