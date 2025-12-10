const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const journalRoute = require("./routes/journals");
const healthRoute = require("./routes/health");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/journals', journalRoute);
app.use("/api/health", healthRoute);
app.use("/api/chat", require("./routes/chat"));

// Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
    console.log("Server restarted at " + new Date().toISOString());
});
