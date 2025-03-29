const express = require('express');
const router = express.Router();
const { addBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost, upload, getBlogPostById, loginUser } = require('../Controller/BlogController');

// Route to add a blog post
router.post('/addblogpost', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, addBlogPost);

// Route to get all blog posts
router.get('/blogposts', getAllBlogPosts);

// Route to update a blog post by ID
router.put('/updateblogpost/:id', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, updateBlogPost);

// Route to get a blog post by ID
router.get('/blogposts/:id', getBlogPostById);

// Route to delete a blog post by ID
router.delete('/deleteblogpost/:id', deleteBlogPost);

// Route to login user
router.post('/login', loginUser);

module.exports = router;