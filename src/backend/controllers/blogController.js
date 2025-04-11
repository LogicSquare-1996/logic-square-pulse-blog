
const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, thumbnailUrl, tags, attachments } = req.body;
    
    const blog = await Blog.create({
      title,
      content,
      excerpt,
      thumbnailUrl,
      author: req.user._id,
      tags,
      attachments
    });

    const populatedBlog = await Blog.findById(blog._id).populate({
      path: 'author',
      select: 'name profilePicture'
    });

    res.status(201).json({
      success: true,
      blog: populatedBlog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt', 
      search = '',
      tag = '',
      featured = '' 
    } = req.query;

    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { 'tags': { $regex: search, $options: 'i' } }
      ];
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Execute query with pagination
    const blogs = await Blog.find(query)
      .populate({
        path: 'author',
        select: 'name profilePicture'
      })
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get total count
    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'name profilePicture'
      })
      .populate({
        path: 'comments.user',
        select: 'name profilePicture'
      })
      .populate({
        path: 'comments.replies.user',
        select: 'name profilePicture'
      });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if user is author
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this blog'
      });
    }

    // Update fields
    const { title, content, excerpt, thumbnailUrl, tags, attachments } = req.body;
    
    blog = await Blog.findByIdAndUpdate(req.params.id, {
      title,
      content,
      excerpt,
      thumbnailUrl,
      tags,
      attachments,
      updatedAt: Date.now()
    }, { new: true, runValidators: true }).populate({
      path: 'author',
      select: 'name profilePicture'
    });

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if user is author
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this blog'
      });
    }

    await blog.remove();

    res.json({
      success: true,
      message: 'Blog removed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Like/Unlike a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if blog has already been liked by this user
    const isLiked = blog.likes.some(like => like.toString() === req.user._id.toString());

    if (isLiked) {
      // Unlike the blog
      blog.likes = blog.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      // Like the blog
      blog.likes.push(req.user._id);
    }

    await blog.save();

    res.json({
      success: true,
      likes: blog.likes,
      likesCount: blog.likes.length,
      isLiked: !isLiked
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text
    };

    blog.comments.unshift(comment);
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id)
      .populate({
        path: 'comments.user',
        select: 'name profilePicture'
      });

    res.status(201).json({
      success: true,
      comments: updatedBlog.comments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Add reply to comment
// @route   POST /api/blogs/:id/comment/:commentId/reply
// @access  Private
exports.addReply = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Find comment
    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    const reply = {
      user: req.user._id,
      text: req.body.text
    };

    comment.replies.push(reply);
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id)
      .populate({
        path: 'comments.user',
        select: 'name profilePicture'
      })
      .populate({
        path: 'comments.replies.user',
        select: 'name profilePicture'
      });

    res.status(201).json({
      success: true,
      comments: updatedBlog.comments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Bookmark/Unbookmark a blog
// @route   PUT /api/blogs/:id/bookmark
// @access  Private
exports.bookmarkBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!blog || !user) {
      return res.status(404).json({
        success: false,
        error: 'Blog or user not found'
      });
    }

    // Check if blog is already bookmarked by this user
    const isBookmarked = user.bookmarks.some(bookmark => bookmark.toString() === blog._id.toString());

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter(bookmark => bookmark.toString() !== blog._id.toString());
    } else {
      // Add bookmark
      user.bookmarks.push(blog._id);
    }

    await user.save();

    res.json({
      success: true,
      bookmarked: !isBookmarked,
      message: isBookmarked ? 'Blog removed from bookmarks' : 'Blog added to bookmarks'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user's bookmarked blogs
// @route   GET /api/blogs/bookmarks
// @access  Private
exports.getBookmarkedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const bookmarkedBlogs = await Blog.find({
      _id: { $in: user.bookmarks }
    }).populate({
      path: 'author',
      select: 'name profilePicture'
    });

    res.json({
      success: true,
      blogs: bookmarkedBlogs
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Rate a blog
// @route   PUT /api/blogs/:id/rate
// @access  Private
exports.rateBlog = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      rating
    }, { new: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
