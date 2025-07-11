// routes/api.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { getGeminiMatches } = require('../services/geminiService');

const adminAuth = (req, res, next) => {
    const secretKey = req.headers['x-admin-secret-key'];
    if (secretKey && secretKey === process.env.ADMIN_SECRET_KEY) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

router.post('/profiles', async (req, res) => {
    try {
        const newProfile = new Profile(req.body);
        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/admin/profiles', adminAuth, async (req, res) => {
    try {
        const profiles = await Profile.find().sort({ submittedAt: -1 });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/admin/matchmake', adminAuth, async (req, res) => {
    try {
        await Profile.updateMany({}, { $set: { matches: [] } });

        const profiles = await Profile.find();

        const menSeekingWomen = profiles.filter(p => p.gender === 'Male' && p.preferredPartner === 'Female');
        const womenSeekingMen = profiles.filter(p => p.gender === 'Female' && p.preferredPartner === 'Male');
        const womenSeekingWomen = profiles.filter(p => p.gender === 'Female' && p.preferredPartner === 'Female');
        
        const heteroMatches = await getGeminiMatches(menSeekingWomen, womenSeekingMen, "Pairing heterosexual men with heterosexual women.");
        
        const lesbianMatches = await getGeminiMatches(womenSeekingWomen, womenSeekingWomen, "Pairing women seeking other women.");

        const allMatches = [...heteroMatches, ...lesbianMatches];

        for (const match of allMatches) {
            if (match.pair && match.pair.length === 2) {
                const [id1, id2] = match.pair;
                const matchInfo = {
                    compatibilityScore: match.compatibilityScore,
                    reasoning: match.reasoning
                };
                await Profile.findByIdAndUpdate(id1, { $push: { matches: { profileId: id2, ...matchInfo } } });
                await Profile.findByIdAndUpdate(id2, { $push: { matches: { profileId: id1, ...matchInfo } } });
            }
        }

        res.status(200).json({ message: 'Matchmaking complete!', matchesFound: allMatches.length, matchDetails: allMatches });
    } catch (error) {
        console.error("Matchmaking error:", error);
        res.status(500).json({ message: 'Failed to perform matchmaking.', error: error.message });
    }
});

router.delete('/admin/profiles/:id', adminAuth, async (req, res) => {
    try {
        const profileId = req.params.id;
        const deletedProfile = await Profile.findByIdAndDelete(profileId);

        if (!deletedProfile) {
            return res.status(404).json({ message: 'Profile not found.' });
        }

        await Profile.updateMany(
            { 'matches.profileId': profileId },
            { $pull: { matches: { profileId: profileId } } }
        );

        res.status(200).json({ message: 'Profile deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;