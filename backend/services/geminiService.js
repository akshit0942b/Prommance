// backend/services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiMatches(profilesA, profilesB, pairingDescription) {
    if (profilesA.length === 0 || profilesB.length === 0) {
        return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const sanitizedProfilesA = profilesA.map(p => ({
        id: p._id.toString(),
        bio: p.bio,
        interests: { movies: p.movies, music: p.music, sports: p.sports, weekend: p.weekendActivity },
        personality: { isIntrovert: p.isIntrovert, textingStyle: p.textingStyle }
    }));

    const sanitizedProfilesB = profilesB.map(p => ({
        id: p._id.toString(),
        bio: p.bio,
        interests: { movies: p.movies, music: p.music, sports: p.sports, weekend: p.weekendActivity },
        personality: { isIntrovert: p.isIntrovert, textingStyle: p.textingStyle }
    }));

    const prompt = `
        You are a decisive and intelligent matchmaking AI. Your task is to create compatible pairs from the provided profiles.
        Description of this pairing task: ${pairingDescription}.

        Profiles - Group A:
        ${JSON.stringify(sanitizedProfilesA, null, 2)}

        Profiles - Group B:
        ${JSON.stringify(sanitizedProfilesB, null, 2)}

        YOUR INSTRUCTIONS:
        1.  You MUST analyze every profile and create pairs. Your goal is to match as many people as possible.
        2.  Each person can only be in ONE match.
        3.  For each pair, you MUST provide a "compatibilityScore" from 1 to 100, where 100 is a perfect match.
        4.  For each pair, you MUST provide a "reasoning" text explaining your decision.
        5.  Your entire output MUST be a single, valid JSON array of objects. Do not include any other text, explanations, or markdown formatting like \`\`\`json.

        The JSON structure for each object in the array MUST be:
        { "pair": ["id_from_group_A", "id_from_group_B"], "compatibilityScore": number, "reasoning": "string" }

        Now, generate the JSON array of matches based on these strict instructions.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonResponse = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonResponse);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return [];
    }
}

module.exports = { getGeminiMatches };