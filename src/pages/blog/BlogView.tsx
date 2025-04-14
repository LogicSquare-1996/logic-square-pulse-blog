
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  ThumbsUp,
  Send,
  MessageCircle,
  Clock,
  Eye,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import api from "@/api/api";
import { mockBlogs } from "@/utils/mockData";

interface Comment {
  id: string;
  user: {
    name: string;
    profilePicture: string;
  };
  text: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

const BlogView = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      if (!id) return;
      
      // Try to fetch from API first
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.blog.getBlogById(id);
          
          if (response.data && response.data.success) {
            setBlog(response.data.blog);
            // Find related blogs based on tags
            fetchRelatedBlogs(response.data.blog.tags);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching blog from API:', error);
          // Fall back to mock data
        }
      }
      
      // Fall back to mock data
      const mockBlog = mockBlogs.find(blog => blog.id === id);
      if (mockBlog) {
        setBlog(mockBlog);
        // Find related blogs based on tags
        const related = mockBlogs
          .filter(blog => blog.id !== id && blog.tags.some(tag => mockBlog.tags.includes(tag)))
          .slice(0, 3);
        setRelatedBlogs(related);
      } else {
        toast.error("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (tags: string[]) => {
    try {
      const response = await api.blog.getBlogs({
        tags,
        limit: 3
      });
      
      if (response.data && response.data.success) {
        const filtered = response.data.blogs.filter((blog: any) => blog._id !== id);
        setRelatedBlogs(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
      // Use mock data instead
      const related = mockBlogs
        .filter(blog => blog.id !== id && blog.tags.some(tag => tags.includes(tag)))
        .slice(0, 3);
      setRelatedBlogs(related);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this blog");
      return;
    }
    
    try {
      if (isLiked) {
        // Unlike blog
        await api.interaction.unlikePost(id || "");
        setIsLiked(false);
        setBlog({
          ...blog,
          likes: blog.likes - 1
        });
      } else {
        // Like blog
        await api.interaction.postInteraction(id || "", {
          category: "like"
        });
        setIsLiked(true);
        setBlog({
          ...blog,
          likes: blog.likes + 1
        });
      }
      
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark this blog");
      return;
    }
    
    try {
      await api.bookmark.toggleBookmark(id || "");
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Blog removed from bookmarks" : "Blog added to bookmarks");
    } catch (error) {
      console.error("Error bookmarking blog:", error);
      toast.error("Failed to update bookmark status");
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      const response = await api.interaction.postInteraction(id || "", {
        category: "comment",
        content: comment.trim(),
        isReply: false
      });
      
      if (response.data && response.data.success) {
        toast.success("Comment added");
        setComment("");
        // Refresh comments
        fetchBlog();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      
      // Demo mode - add comment locally
      const newComment = {
        id: `comment-${Date.now()}`,
        user: {
          name: user?.name || "Anonymous",
          profilePicture: user?.profilePicture || "https://via.placeholder.com/150"
        },
        text: comment,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: []
      };
      
      setBlog({
        ...blog,
        comments: [newComment, ...(blog.comments || [])]
      });
      setComment("");
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to reply");
      return;
    }
    
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      const response = await api.interaction.postInteraction(id || "", {
        category: "comment",
        content: replyText.trim(),
        isReply: true,
        parentComment: commentId
      });
      
      if (response.data && response.data.success) {
        toast.success("Reply added");
        setReplyText("");
        setReplyingTo(null);
        // Refresh comments
        fetchBlog();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
      
      // Demo mode - add reply locally
      const updatedComments = blog.comments.map((comment: Comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: `reply-${Date.now()}`,
                user: {
                  name: user?.name || "Anonymous",
                  profilePicture: user?.profilePicture || "https://via.placeholder.com/150"
                },
                text: replyText,
                createdAt: new Date().toISOString(),
                likes: 0,
                replies: []
              }
            ]
          };
        }
        return comment;
      });
      
      setBlog({
        ...blog,
        comments: updatedComments
      });
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8 animate-pulse"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/4 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blogs">
          <Button>Back to Blogs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${blog.thumbnailUrl})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto h-full flex items-center relative z-10 px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{blog.title}</h1>
            <div className="flex items-center text-white space-x-4 mb-6">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{blog.author.name}</p>
                  <p className="text-sm text-gray-300">{blog.author.title}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/30" />
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(blog.createdAt)}</span>
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/30" />
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-sm">{blog.comments?.length || 0} comments</span>
              </div>
              <Separator orientation="vertical" className="h-8 bg-white/30" />
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span className="text-sm">{blog.views || 0} views</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className="bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="lg:flex lg:gap-12">
          {/* Article */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-8">
              <div className="prose lg:prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>

              <Separator className="my-8" />
              
              {/* Article Footer */}
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={isLiked ? "text-red-500 border-red-500" : ""}
                    onClick={handleLike}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} /> 
                    {blog.likes || 0} Likes
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBookmark}>
                    <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} /> 
                    Bookmark
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">About the Author</h3>
              <div className="flex items-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-lg">{blog.author.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{blog.author.title}</p>
                  <p className="mt-2">{blog.author.bio || "Logic Square team member passionate about sharing knowledge and insights."}</p>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-semibold mb-6">Comments ({blog.comments?.length || 0})</h3>
              
              {isAuthenticated ? (
                <div className="mb-8">
                  <Textarea
                    placeholder="Share your thoughts about this blog..."
                    className="mb-3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment}>
                    <MessageCircle className="mr-2 h-4 w-4" /> Add Comment
                  </Button>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <p className="mb-3">Please login to join the conversation</p>
                  <Link to="/login">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              )}
              
              <div className="space-y-6">
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment: Comment) => (
                    <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={comment.user.profilePicture} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{comment.user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="inline h-3 w-3 mr-1" />
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleLike}>
                          <ThumbsUp className="h-4 w-4 mr-1" /> {comment.likes}
                        </Button>
                      </div>
                      
                      <p className="ml-10 text-gray-700 dark:text-gray-300 mb-2">{comment.text}</p>
                      
                      <div className="ml-10">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                          Reply
                        </Button>
                        
                        {replyingTo === comment.id && (
                          <div className="mt-3 flex items-center">
                            <Textarea
                              placeholder="Write a reply..."
                              className="text-sm mr-2 min-h-[80px]"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comment.replies.map((reply: Comment) => (
                              <div key={reply.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                <div className="flex justify-between">
                                  <div className="flex items-center mb-1">
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={reply.user.profilePicture} alt={reply.user.name} />
                                      <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">{reply.user.name}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(reply.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="h-3 w-3 mr-1" /> {reply.likes}
                                  </Button>
                                </div>
                                <p className="ml-8 text-sm text-gray-700 dark:text-gray-300">{reply.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            {/* Related Articles */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
              {relatedBlogs.length > 0 ? (
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog: any) => (
                    <Link 
                      key={relatedBlog.id || relatedBlog._id} 
                      to={`/blog/${relatedBlog.id || relatedBlog._id}`}
                      className="group block"
                    >
                      <div className="flex items-start">
                        <img 
                          src={relatedBlog.thumbnailUrl}
                          alt={relatedBlog.title}
                          className="h-16 w-24 object-cover rounded group-hover:opacity-90 mr-3"
                        />
                        <div>
                          <h4 className="font-medium group-hover:text-blog-purple line-clamp-2 mb-1">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(relatedBlog.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No related articles found.</p>
              )}
            </div>
            
            {/* Popular Tags */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, index: number) => (
                  <Link 
                    key={index} 
                    to={`/blogs?tag=${tag}`}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </Link>
                ))}
                <Link 
                  to="/blogs"
                  className="bg-blog-purple/10 text-blog-purple hover:bg-blog-purple/20 text-sm px-3 py-1 rounded-full"
                >
                  View All Tags
                </Link>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blog-purple to-blog-purple-dark text-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Subscribe to Newsletter</h3>
              <p className="text-white/80 text-sm mb-4">
                Stay updated with the latest blogs and insights
              </p>
              <div className="flex">
                <input 
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 text-gray-900 rounded-l-md focus:outline-none text-sm"
                />
                <Button className="rounded-l-none bg-white text-blog-purple hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Next/Prev Article Navigation */}
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between">
            <Link to="/blogs" className="mb-4 sm:mb-0">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> All Blogs
              </Button>
            </Link>
            
            <Link to="#" className="self-end">
              <Button variant="outline">
                Next Article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
