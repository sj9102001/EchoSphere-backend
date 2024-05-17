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
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
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
                    id: user.id,
                    bio: user.bio
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

exports.update = async (req, res) => {
    const { name: newName, bio: newBio } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                name: newName,
                bio: newBio
            }
        });
        res.status(200).json({
            message: "Information Updated Successfully", user: {
                email: updatedUser.email, id: updatedUser.id, name: updatedUser.name, bio: updatedUser.bio,
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.delete = async (req, res) => {
    try {
        //delete the current users friendlist and remove from everyone friendlist 
        const deleted = await prisma.friend.deleteMany({
            where: {
                OR: [
                    {
                        user1Id: req.user.id,
                    },
                    {
                        user2Id: req.user.id
                    }
                ]
            }
        });
        //delete the user
        console.log("Here", deleted);
        const deletedUser = await prisma.user.delete({
            where: {
                id: req.user.id
            },
        });
        res.status(200).json({
            message: "Profile deleted Successfully", user: {
                email: deletedUser.email, id: deletedUser.id, name: deletedUser.name, bio: deletedUser.bio,
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.searchUsers = async (req, res) => {
    const query = req.params.query;
    console.log(query);
    try {
        const foundUsers = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query
                        }
                    },
                    {
                        email: {
                            contains: query
                        }
                    }
                ]
            },
            select: {
                userId: true,
                name: true,
                email: true
            }
        });
        if (foundUsers.length > 0) {
            return res.status(200).json({ data: foundUsers })
        } else {
            return res.status(404).json({ message: "No Users Found" });

        }
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
                name: user.name,
                bio: user.bio,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}