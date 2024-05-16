const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { verifyUser } = require("../middlewares/verifyUser");

router.post('/', verifyUser, friendController.sendFriendRequest);

router.get('/', verifyUser, friendController.fetchAllRequests);

router.post('/accept', verifyUser, friendController.acceptRequest);

router.get('/all', verifyUser, friendController.fetchAllFriends);

module.exports = router;