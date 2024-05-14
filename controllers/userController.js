const prisma = require("../db/db.config")
const bcrypt = require("bcrypt")

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