import express from 'express'
import { connectDB } from '../config/connectDB.js'
import { Voting } from '../models/VotingModel.js'

const router = express.Router();

router.post('/api/get-voting-list', async (req, res) => {
    await connectDB();

    try {
        const res = await Voting.find();
        console.log(res);

        return res.status(200).json({
            success: true,
            message: "Voting list fetched",
            data: res
        });

    } catch (err) {
        console.log(`Error -> `, err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

export default router;