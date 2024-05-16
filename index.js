const express = require("express");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require('./routes/friendRoutes');

const PORT = process.env.port || 8080;

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(cookieParser());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/friend', friendRoutes);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});