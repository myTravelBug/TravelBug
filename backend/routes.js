const express = require('express');
const router = express.Router();
const Post = require('./models/Post');
const Thread = require('./models/Thread');
const Comment = require('./models/Comment');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

//http://localhost:5000/api/all-posts GET
router.get('/all-posts', async (req, res) => {
	let allPosts = await Post.find();
	res.json(allPosts);
});

//http://localhost:5000/api/all-threads GET
router.get('/all-threads', async (req, res) => {
	let allThread = await Thread.find();
	res.json(allThread);
});
//http://localhost:5000/api/all-threads GET
router.get('/all-comments', async (req, res) => {
	let allComment = await Comment.find();

	res.json(allComment);
});

router.post('/new-comment', authorize, async (req, res) => {
	console.log(req.body, 'watermelon');
	let newComment = req.body;
	newComment.userId = res.locals.user._id;
	let comment = await Comment.create(newComment);
	res.json(comment);
});

//http://localhost:5000/api/new-post POST
router.post('/new-post', authorize, async (req, res) => {
	//Everyime you put authorize as middleware you'll have the user as res.locals.user
	let newPost = req.body;
	newPost.userId = res.locals.user._id; //How we add the userId to the post document
	let post = await Post.create(newPost);
	res.json(post);
});

router.post('/new-thread', authorize, async (req, res) => {
	//Everyime you put authorize as middleware you'll have the user as res.locals.user
	let newThread = req.body;
	newThread.userId = res.locals.user._id; //How we add the userId to the post document
	let thread = await Thread.create(newThread);
	res.json(thread);
});

router.get('/get-user', authorize, async (req, res) => {
	let user = await User.findById(res.locals.user._id);
	res.json(user);
});

router.post('/authenticate', async (req, res) => {
	let user = await User.findOne({ email: req.body.email });
	if (!user) {
		//if the user is not in database create them
		user = await User.create(req.body);
	}
	jwt.sign({ user }, 'secret key', { expiresIn: '99980min' }, (err, token) => {
		res.json({ user, token });
	});
});

//Middleware >>> Put this in the middle of any route where you want to authorize
function authorize(req, res, next) {
	let token = req.headers.authorization.split(' ')[1]; //Token from front end
	if (token) {
		jwt.verify(token, 'secret key', (err, data) => {
			if (!err) {
				res.locals.user = data.user; //Set global variable with user data in the backend
				next();
			} else {
				res.status(403).json({ message: err });
				//throw new Error({ message: "ahhh" })
			}
		});
	} else {
		res.status(403).json({ message: 'Must be logged in!' });
	}
}

module.exports = router;
