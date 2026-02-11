import express from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticate } from '../middleware/authenticate.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/api/register', rateLimit, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const present = await User.findOne({ email });

        if (present) {
            return res.status(400).json({
                success: false,
                message: "Email linked with another user",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "User created successfull",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

router.post('/api/login', rateLimit, async (req, res) => {
    const { email, password } = req.body;

    try {
        const present = await User.findOne({ email });

        if (!present) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, present.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ email: email, name: present.name, userId: present._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 840000,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });
 
        return res.status(200).json({
            success: true,
            message: "Login seccessfull",
            role: 'user',
            token
        });

    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

router.get('/api/user-verify', authenticate, async (req, res) => {

    return res.status(200).json({
        success: true,
        message: 'user verified',
        data: req.userData
    });
});

export default router;