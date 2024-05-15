const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validationResults } = require('../middlewares/validationResult');

const userController = require('../controllers/userController');


router.post('/signup',
    body('email').trim().notEmpty().isEmail().withMessage("Please enter a valid email address"),
    body('username').trim().isLength({ min: 4 }).withMessage("Please enter a valid username"),
    body('password').isLength({ min: 8 }).withMessage("Password should be greater than 8"),
    validationResults,
    userController.signup
);

router.post('/login',
    body('email').trim().notEmpty().isEmail().withMessage("Please enter a valid email address"),
    body('password').isLength({ min: 8 }).withMessage("Password should be greater than 8"),
    validationResults,
    userController.login
);

module.exports = router;
