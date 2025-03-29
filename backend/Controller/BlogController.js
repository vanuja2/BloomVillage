const Blog = require('../Models/Blog');
const User = require('../Models/User');
const multer = require('multer');
const path = require('path');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage: storage }).single('image'); // Allow a single image upload

// Add a new blog post
const addBlogPost = async (req, res) => {
  try {
    const { userId, name, title, item, category, description, price } = req.body;
    const image = req.file ? req.file.path : ''; // Get the path of the uploaded image

    const newBlogPost = new Blog({
      userId,
      name,
      title,
      item,
      category,
      description,
      price,
      image
    });

    await newBlogPost.save();
    res.status(201).json({ message: 'Blog post added successfully', blogPost: newBlogPost });
  } catch (error) {
    res.status(500).json({ message: 'Error adding blog post', error: error.message });
  }
};

// Get all blog posts
const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
};

// Get a blog post by ID
const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await Blog.findById(id);
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
};

// Update a blog post
const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, name, title, item, category, description, price } = req.body;
    const image = req.file ? req.file.path : undefined;

    const updatedData = { userId, name, title, item, category, description, price };
    if (image) updatedData.image = image;

    const updatedBlogPost = await Blog.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedBlogPost) return res.status(404).json({ message: 'Blog post not found' });

    res.status(200).json({ message: 'Blog post updated successfully', blogPost: updatedBlogPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post', error: error.message });
  }
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlogPost = await Blog.findByIdAndDelete(id);
    if (!deletedBlogPost) return res.status(404).json({ message: 'Blog post not found' });

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
};

// Login Seller
const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      const seller = await Seller.findOne({ email });
      if (!seller) {
          return res.status(400).json({ message: 'Seller not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, seller.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: seller._id }, 'your_secret_key', { expiresIn: '1d' });
      res.json({ message: 'Login successful', token, seller });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


module.exports = { addBlogPost, getAllBlogPosts, updateBlogPost, deleteBlogPost, upload, getBlogPostById, loginUser };