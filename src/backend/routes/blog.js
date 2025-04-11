
const express = require('express');
const router = express.Router();
const { 
  createBlog, 
  getBlogs, 
  getBlog, 
  updateBlog, 
  deleteBlog, 
  likeBlog, 
  addComment, 
  addReply, 
  bookmarkBlog,
  getBookmarkedBlogs,
  rateBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Routes
router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/bookmarks')
  .get(protect, getBookmarkedBlogs);

router.route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like')
  .put(protect, likeBlog);

router.route('/:id/bookmark')
  .put(protect, bookmarkBlog);

router.route('/:id/comment')
  .post(protect, addComment);

router.route('/:id/comment/:commentId/reply')
  .post(protect, addReply);

router.route('/:id/rate')
  .put(protect, rateBlog);

module.exports = router;
