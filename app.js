const express = require("express");
const connectMongoDB = require("./database/mongodb");
const mongoose = require("mongoose");
const app = express();
const albums = require("./routes/albums");
const config = require('./utils/config')
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();

app.use(express.json());
app.use("/api/albums", albums);
app.use(errorHandler);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

module.exports = app
