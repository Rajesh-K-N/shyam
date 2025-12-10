const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

router.post('/', async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Log the attempt
    console.log("Processing chat request with OpenRouter (DeepSeek R1)...");

    try {
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            "model": "tngtech/deepseek-r1t2-chimera:free",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Shyam Health Tracker",
                "Content-Type": "application/json"
            }
        });

        const reply = response.data.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error("Error generating content:", error);

        // Log detailed error to a file for debugging
        const fs = require('fs');
        const logMessage = `
Timestamp: ${new Date().toISOString()}
Error: ${error.message}
Response: ${JSON.stringify(error.response?.data)}
Stack: ${error.stack}
----------------------------------------
`;
        fs.appendFile('error.log', logMessage, (err) => {
            if (err) console.error("Failed to write to error log:", err);
        });

        res.status(500).json({ error: "Failed to generate response. Please check the server logs." });
    }
});

module.exports = router;
