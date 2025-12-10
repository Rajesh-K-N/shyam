const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    try {
        const response = await axios.get("https://openrouter.ai/api/v1/models");
        const models = response.data.data;
        console.log("Found " + models.length + " models.");

        console.log("\n--- DeepSeek Models ---");
        const deepseekModels = models.filter(m => m.id.toLowerCase().includes("deepseek"));
        deepseekModels.forEach(m => console.log(m.id));

        console.log("\n--- Chimera Models ---");
        const chimeraModels = models.filter(m => m.id.toLowerCase().includes("chimera"));
        chimeraModels.forEach(m => console.log(m.id));

        console.log("\n--- R1 Models ---");
        const r1Models = models.filter(m => m.id.toLowerCase().includes("r1"));
        r1Models.forEach(m => console.log(m.id));

    } catch (error) {
        console.error("Error listing models:", error.message);
    }
}

listModels();
