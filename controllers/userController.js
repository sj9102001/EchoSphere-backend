const prisma = require("../db/db.config")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');


const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = 10;

exports.signup = async (req, res) => {
    try {
        //parsing fields
        const { username, email, password } = req.body;

        //checking if user already exists
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            return res.status(400).json({ message: "User already exist" });
        }
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: username,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "User successfully created, please login!" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("It hits");
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        //checking if user does not exists
        if (!user) {
            return res.status(404).json({ message: "User not found, sign in" });
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (isCorrectPassword) {
            //signign the jwt token and sending as response
            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                message: "Success, re-directing you to home page", user: {
                    name: user.name,
                    email: user.email,
                    id: user.id
                }
            });
        } else {
            res.status(401).json({ message: "Wrong credentials, please re-enter" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.verifyAuth = async (req, res) => {
    try {
        res.status(200).json({
            user: {
                email: req.user.email,
                name: req.user.name,
                id: req.user.id
            }, message: "User is authorized"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.logout = async (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true
        });
        res.status(200).json({ message: "You have been successfully logged out" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.getData = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        res.status(200).json({
            data: {
                email: user.email,
                username: user.name,
                bio: user.bio,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}