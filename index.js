const { OpenAI } = require("openai");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: "YOUR_OPENAI_API_KEY",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to get the latest transcript and provide a response
app.get("/getResponse", async (req, res) => {
    try {
        // Fetch the latest transcript from the PHP script
        const phpResponse = await axios.get(
            "http://your-server/voiceToText.php",
        );
        const transcript = phpResponse.data.transcript;

        // If there is no transcript, respond with an appropriate message
        if (!transcript) {
            res.json({ response: "No command recorded yet" });
            return;
        }

        // Get response from OpenAI
        const openAIResponse = await openai.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: transcript }],
        });

        const aiResponse = openAIResponse.choices[0].message.content;

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ response: "An error occurred." });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
