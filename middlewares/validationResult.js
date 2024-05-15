const { validationResult } = require('express-validator');

const validationResults = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    res.status(400).json({ errors: result.array(), message: "Enter valid credentials" });
}
module.exports = {
    validationResults
}   