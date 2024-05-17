const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const { verifyUser } = require("../middlewares/verifyUser");

router.post('/request', verifyUser, friendController.sendFriendRequest);

router.get('/request', verifyUser, friendController.fetchAllRequests);

router.post('/request/accept', verifyUser, friendController.acceptRequest);

router.get('/', verifyUser, friendController.fetchAllFriends);

module.exports = router;