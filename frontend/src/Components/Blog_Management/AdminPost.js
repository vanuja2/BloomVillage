import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const BlogPostsPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    title: '',
    item: '',
    category: '',
    description: '',
    price: '',
    image: '',
  });

  const categories = [
    'Ayurvedic Medicine Recipes',
    'Rare Plants',
    'Rare Animals',
    'Other',
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8081/api/blogposts');
      setBlogPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(false);
      showSnackbar('Error fetching blog posts', 'error');
    }
  };

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      item: post.item,
      category: post.category,
      description: post.description,
      price: post.price,
      image: post.image,
    });
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (post) => {
    setCurrentPost(post);
    setOpenDeleteDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentPost(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentPost(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePost = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/updateblogpost/${currentPost._id}`,
        formData
      );
      fetchBlogPosts();
      handleCloseEditDialog();
      showSnackbar('Post updated successfully', 'success');
    } catch (error) {
      console.error('Error updating post:', error);
      showSnackbar('Error updating post', 'error');
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(
        `http://localhost:8081/api/deleteblogpost/${currentPost._id}`
      );
      fetchBlogPosts();
      handleCloseDeleteDialog();
      showSnackbar('Post deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting post:', error);
      showSnackbar('Error deleting post', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const generatePdf = (post) => {
    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text('Blog Post Details', 105, 20, { align: 'center' });
    
    // Add a line separator
    doc.setDrawColor(40, 53, 147);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Add post image (if available)
    if (post.image) {
      try {
        const img = new Image();
        img.src = `http://localhost:8081/${post.image}`;
        doc.addImage(img, 'JPEG', 15, 30, 50, 50);
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }
    
    // Add post details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Title: ${post.title}`, post.image ? 70 : 20, 35);
    
    doc.setFontSize(12);
    doc.text(`Item: ${post.item}`, post.image ? 70 : 20, 45);
    doc.text(`Price: $${post.price}`, post.image ? 70 : 20, 55);
    doc.text(`Category: ${post.category}`, post.image ? 70 : 20, 65);
    
    // Add description with proper formatting
    doc.setFontSize(12);
    doc.text('Description:', 20, 85);
    const descriptionLines = doc.splitTextToSize(post.description, 170);
    doc.text(descriptionLines, 20, 95);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Posted by: ${post.name}`, 20, doc.internal.pageSize.height - 20);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 160, doc.internal.pageSize.height - 20, { align: 'right' });
    
    // Save the PDF
    doc.save(`${post.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Blog Posts
      </Typography>

      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8081/${post.image}`}
                alt={post.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {post.item} - ${post.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Category: {post.category}
                </Typography>
                <Typography variant="body2" paragraph>
                  {post.description.length > 100
                    ? `${post.description.substring(0, 100)}...`
                    : post.description}
                </Typography>
                <Typography variant="caption" display="block">
                  Posted by: {post.name}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(post)}
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(post)}
                    variant="outlined"
                  >
                    Delete
                  </Button>
                </Box>
                <Tooltip title="Download as PDF">
                  <IconButton 
                    color="primary" 
                    onClick={() => generatePdf(post)}
                    aria-label="download pdf"
                    sx={{ 
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Blog Post</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="item"
            label="Item"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.item}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            select
            fullWidth
            variant="outlined"
            value={formData.category}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdatePost} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{currentPost?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlogPostsPage;