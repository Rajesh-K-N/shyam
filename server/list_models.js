const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy model to get client
        // Actually, the SDK doesn't have a direct listModels method on the client instance easily accessible in all versions.
        // But we can try to just run a simple generation with a very basic model like 'gemini-pro' and catch the error, 
        // OR use the REST API directly to list models.

        // Let's use the REST API to list models because the SDK might hide the list method.
        // https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Available Models:");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
