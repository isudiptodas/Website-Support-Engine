import express from 'express'
import { Voting } from '../models/VotingModel.js'
import { redisConnect } from '../config/redisConnect.js';
import { authenticate } from '../middleware/authenticate.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();

router.get('/api/get-voting-list', rateLimit, async (req, res) => {

    try {

        const cached = await redisConnect.get('allVoting');

        if (cached) {
            return res.status(200).json({
                success: true,
                message: "Voting list fetched from redis",
                data: JSON.parse(cached)
            });
        }

        const found = await Voting.find();
        await redisConnect.set('allVoting', JSON.stringify(found));

        return res.status(200).json({
            success: true,
            message: "Voting list fetched from db",
            data: found
        });

    } catch (err) {
        console.log(`Error -> `, err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

router.put('/api/cast-vote', rateLimit, authenticate, async (req, res) => {

    const { campaignID, answer } = req.body;
    const userData = req.userData;

    try {
        const found = await Voting.findOneAndUpdate({
            _id: campaignID,
            "options.text": answer
        }, {
            $push: { voterEmail: userData.email },
            $inc: { totalVotes: 1, "options.$.votes": 1 }
        }, {
            new: true
        });

        if (!found) {
            return res.status(404).json({
                success: false,
                message: "Can't vote for this campaign"
            });
        }

        const campaigns = await Voting.find();
        await redisConnect.set('allVoting', JSON.stringify(campaigns));

        return res.status(200).json({
            success: true,
            message: "Voting successfull",
            data: campaigns
        });

    } catch (err) {
        console.log(`Error -> `, err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

router.post('/api/create-campaign', rateLimit, authenticate, async (req, res) => {
    const { title, source, options, expiry, category } = req.body;
    const userdata = req.userData;

    const updatedOptions = options.map((item) => {
        return { text: item.text, votes: 0 }
    });

    try {

        const newVoting = new Voting({
            title, source,
            optionNumber: updatedOptions.length,
            expiry,
            options: updatedOptions,
            userEmail: userdata.email,
            category
        });

        await newVoting.save();
        
        const campaigns = await Voting.find();
        await redisConnect.set('allVoting', JSON.stringify(campaigns));

        return res.status(200).json({
            success: true,
            message: "Campaign created",
            newVoting
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

