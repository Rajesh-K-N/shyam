const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

console.log("Attempting to connect to:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to DB successfully.");
        console.log("Database Name:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);

        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.name} (${u.email})`));
        process.exit();
    })
    .catch(err => {
        console.error("Connection Error:", err);
        process.exit(1);
    });
