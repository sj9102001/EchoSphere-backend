const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyUser } = require("../middlewares/verifyUser");

router.post('/create', verifyUser, postController.createPost);
router.delete('/delete', verifyUser, postController.deletePost);
router.put('/update', verifyUser, postController.updatePost);
router.get('/fetch', verifyUser, postController.fetchPost);
router.get('/feed', verifyUser, postController.fetchFeed);

module.exports = router;
// add post
// delete post
//  update post
//  fetch post of user
//  fetch feed ( feed me basically, posts of all friends sorted by time )