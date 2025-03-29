import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Chip,
  Container,
  CircularProgress,
  Paper,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Favorite,
  Share,
  Comment,
  MoreVert,
  Send,
  Search,
  FilterList,
  Sort,
  FavoriteBorder
} from '@mui/icons-material';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

const BlogPostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [openComments, setOpenComments] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleLike = async () => {
    try {
      // Call your API to like the post
      // await axios.put(`/api/blogposts/like/${post._id}`);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const demoComment = {
        _id: Date.now().toString(),
        text: newComment,
        user: { name: 'You' },
        createdAt: new Date()
      };
      
      setComments([...comments, demoComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', m: 1 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {post.name?.charAt(0) || 'U'}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVert />
            </IconButton>
          }
          title={post.title}
          subheader={new Date(post.createdAt).toLocaleDateString()}
        />
        
        <CardMedia
          component="img"
          height="200"
          image={`http://localhost:8081/${post.image}`}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Chip label={post.category} color="primary" size="small" />
            <Typography variant="h6" color="text.secondary">
              ${post.price}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            {expanded ? post.description : `${post.description.substring(0, 100)}...`}
            {post.description.length > 100 && (
              <Button size="small" onClick={handleExpandClick}>
                {expanded ? 'Show less' : 'Read more'}
              </Button>
            )}
          </Typography>
        </CardContent>
        
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={handleLike}>
            {liked ? <Favorite color="error" /> : <FavoriteBorder />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {post.likes || 0}
            </Typography>
          </IconButton>
          
          <IconButton 
            aria-label="comment" 
            onClick={() => setOpenComments(true)}
          >
            <Comment />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {comments.length}
            </Typography>
          </IconButton>
          
          <IconButton 
            aria-label="share" 
            onClick={() => setOpenShare(true)}
          >
            <Share />
          </IconButton>
        </CardActions>
        
        {/* Comments Dialog */}
        <Dialog open={openComments} onClose={() => setOpenComments(false)}>
          <DialogTitle>Comments</DialogTitle>
          <DialogContent>
            {comments.length === 0 ? (
              <Typography>No comments yet</Typography>
            ) : (
              comments.map(comment => (
                <Box key={comment._id} sx={{ mb: 2, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle2">{comment.user.name}</Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              ))
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Add a comment"
              fullWidth
              variant="standard"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenComments(false)}>Cancel</Button>
            <Button onClick={handleAddComment} startIcon={<Send />}>Post</Button>
          </DialogActions>
        </Dialog>
        
        {/* Share Dialog */}
        <Dialog open={openShare} onClose={() => setOpenShare(false)}>
          <DialogTitle>Share this post</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} justifyContent="center" sx={{ p: 2 }}>
              <Grid item>
                <FacebookShareButton
                  url={`${window.location.origin}/blogposts/${post._id}`}
                  quote={post.title}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </Grid>
              <Grid item>
                <TwitterShareButton
                  url={`${window.location.origin}/blogposts/${post._id}`}
                  title={post.title}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </Grid>
              <Grid item>
                <WhatsappShareButton
                  url={`${window.location.origin}/blogposts/${post._id}`}
                  title={post.title}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenShare(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Grid>
  );
};

const BlogPostsPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const postsPerPage = 6;

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))];

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8081/api/blogposts');
        setBlogPosts(response.data);
        setFilteredPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...blogPosts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(post => post.category === categoryFilter);
    }
    
    // Apply price range filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        result = result.filter(post => post.price >= min && post.price <= max);
      } else {
        result = result.filter(post => post.price >= min);
      }
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        // Assuming we have a likes field
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        break;
    }
    
    setFilteredPosts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [blogPosts, searchTerm, categoryFilter, priceRange, sortOption]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      
      {/* Search and Filter Bar */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                label="Price Range"
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="0-50">$0 - $50</MenuItem>
                <MenuItem value="50-100">$50 - $100</MenuItem>
                <MenuItem value="100-500">$100 - $500</MenuItem>
                <MenuItem value="500-">$500+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                label="Sort By"
                startAdornment={
                  <InputAdornment position="start">
                    <Sort />
                  </InputAdornment>
                }
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              fullWidth
            >
              <ToggleButton value="grid" aria-label="grid view">
                <i className="fas fa-th"></i>
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <i className="fas fa-list"></i>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results count */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        {searchTerm && ` for "${searchTerm}"`}
      </Typography>
      
      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Typography variant="h6" color="text.secondary">
            No posts found matching your criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentPosts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default BlogPostsPage;