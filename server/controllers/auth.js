import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/Users.js"

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        // Bringing out the detials from the user destructuring.
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            loaction,
            occupation,
        } = req.body

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        // Saving the fetched details in the newUser
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            loaction,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        // Creating the savedUser variable and 
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })
        if (!user) return res.status(400).json({ msg: "User does not exist." })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." })

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        delete user.password;

        res.status(200).json({ token, user })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}