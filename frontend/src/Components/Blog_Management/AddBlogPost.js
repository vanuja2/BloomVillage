import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function AddBlogPost() {
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    title: '',
    item: '',
    category: '',
    description: '',
    price: ''
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage({
        id: URL.createObjectURL(file),
        file,
      });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { userId, name, title, item, description, price } = formData;

    // Check for empty fields
    if (!userId || !name || !title || !item || !description) {
      return 'All fields except category are required.';
    }

    // Validate that name, title, and item are only strings (varchars)
    const stringPattern = /^[a-zA-Z\s]+$/; // Only letters and spaces
    if (!stringPattern.test(name)) {
      return 'Your Name must contain only letters.';
    }
    if (!stringPattern.test(title)) {
      return 'Blog Title must contain only letters.';
    }
    if (!stringPattern.test(item)) {
      return 'Item Name must contain only letters.';
    }

    // Check if price is a valid positive number
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return 'Price must be a positive number.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Reset error message

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append('userId', formData.userId);
    data.append('name', formData.name);
    data.append('title', formData.title);
    data.append('item', formData.item);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('price', formData.price);

    if (image) {
      data.append('image', image.file);
    }

    try {
      const response = await fetch('http://localhost:8081/api/addblogpost', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Blog post added successfully');
        navigate(`/adminposts`);
        setFormData({
          userId: '',
          name: '',
          title: '',
          item: '',
          category: '',
          description: '',
          price: ''
        });
        setImage(null);
      } else {
        setErrorMessage(result.message || 'Failed to add blog post');
      }
    } catch (error) {
      setErrorMessage('Error adding blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Add New Blog Post
        </Typography>
        
        {errorMessage && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User  ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Blog Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <MenuItem value="" disabled>Select a category</MenuItem>
                  <MenuItem value="Ayurvedic Medicine Recipes">Ayurvedic Medicine Recipes</MenuItem>
                  <MenuItem value="Rare Plants">Rare Plants</MenuItem>
                  <MenuItem value="Rare Animals">Rare Animals</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                Upload Image
                <VisuallyHiddenInput 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Upload a single image for your blog post
              </Typography>
            </Grid>
            
            {image && (
              <Grid item xs={12}>
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 300 }}>
                  <Box
                    component="img"
                    src={image.id}
                    alt="Selected"
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      borderRadius: 1,
                      boxShadow: 1
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting}
                sx={{ py: 1.5, mt: 2 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Add Blog Post'
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddBlogPost;