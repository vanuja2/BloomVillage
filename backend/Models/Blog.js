const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogPostSchema = new Schema({
  userId: { type: String, required: true }, 
  name: { type: String, required: true }, 
  title: { type: String, required: true }, 
  item: { type: String, required: true }, 
  category: { type: String, required: true }, 
  description: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  image: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Blog', blogPostSchema);