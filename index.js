const express = require("express");
require('dotenv').config();
const PORT = process.env.port || 8080;

const app = express();


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});