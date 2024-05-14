const express = require("express");
require('dotenv').config();

const PORT = process.env.port || 8080;
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(express.json());

app.use('/user', userRoutes);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});