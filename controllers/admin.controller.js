import jwt from 'jsonwebtoken'
import { Admin } from '../models/admin.model.js'
import { User } from '../models/user.model.js'


//this logic is to add admin credentials to backend
export const addAdmin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" })
    }

    const admin = await Admin.create({
        email,
        password
    })

    if (!admin) {
        return res.status(500).json({ error: "Failed to add admin" })
    }

    return res.status(200).json({ message: "Admin added successfully" })

}

// this logic is to login admin
export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" })
    }

    const user = await Admin.findOne({ email })

    if (!user) {
        return res.status(404).json({ error: "Admin does not Found" })
    }

    const isPasswordCorrect = await user.isPasswordValid(password)

    if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid Password" })
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    return res
        .status(200)
        .json({ message: "Authentication Complete", token, id: user._id });
}

export const allUsers = async (req, res) => {
    const users = await User.find().select("-password")

    if (!users) {
        return res.status(404).json({ error: "No users found" })
    }

    return res
        .status(200)
        .json(users)

}

export const changeRolesToStaff = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ error: "User ID is required" })
    }

    const user = await User.findByIdAndUpdate(
        id,
        {
            $set: {
                role: "staff"
            }
        },
        { new: true }
    )

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    return res
        .status(200)
        .json({ message: "Role Changed Successfully" })

}

export const changeRolesToCustomer = async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ error: "User ID is required" })
    }

    const user = await User.findByIdAndUpdate(
        id,
        {
            $set: {
                role: "customer"
            }
        },
        { new: true }
    )

    if (!user) {
        return res.status(404).json({ error: "User not found" })
    }

    return res
        .status(200)
        .json({ message: "Role Changed Successfully" })

}