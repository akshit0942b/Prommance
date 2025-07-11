// models/Profile.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    bio: { type: String, required: true },
    movies: { type: String },
    weekendActivity: { type: String },
    music: { type: String },
    sports: { type: String },
    isIntrovert: { type: Boolean, required: true },
    textingStyle: { type: String },
    preferredPartner: { type: String, enum: ['Male', 'Female'], required: true },
    submittedAt: { type: Date, default: Date.now },
    matches: [{
        profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
        compatibilityScore: { type: Number },
        reasoning: { type: String }
    }]
});

module.exports = mongoose.model('Profile', ProfileSchema);