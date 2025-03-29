const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./Config/Config");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();

// Link Routes

dotenv.config(); 
connectDB();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Routes

app.use('/api', require('./Routes/BlogRoute'));

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});