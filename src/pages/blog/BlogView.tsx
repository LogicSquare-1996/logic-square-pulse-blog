
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Bookmark, Share2, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import * as blogApi from "@/api/blog";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const BlogView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await blogApi.getBlogById(id);
        if (data) {
          setBlog(data);
          
          // Check if user has liked this blog
          if (isAuthenticated && user && data.likes) {
            const liked = data.likes.includes(user._id);
            setIsLiked(liked);
          }
          
          setLikesCount(data.likes?.length || 0);
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, isAuthenticated, user]);
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like this post");
      return;
    }
    
    try {
      const response = await blogApi.likeBlog(id!);
      if (response) {
        setIsLiked(response.isLiked);
        setLikesCount(response.likesCount);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };
  
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark this post");
      return;
    }
    
    try {
      const response = await blogApi.bookmarkBlog(id!);
      if (response) {
        setIsBookmarked(response.bookmarked);
      }
    } catch (error) {
      console.error("Error bookmarking blog:", error);
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }
    
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    try {
      const updatedComments = await blogApi.addComment(id!, commentText);
      if (updatedComments) {
        setBlog({ ...blog, comments: updatedComments });
        setCommentText("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  const handleReplySubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to reply");
      return;
    }
    
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    try {
      const updatedComments = await blogApi.addReply(id!, commentId, replyText);
      if (updatedComments) {
        setBlog({ ...blog, comments: updatedComments });
        setReplyText("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-6 animate-pulse"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !blog) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Error</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{error || "Blog not found"}</p>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const timeAgo = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft size={18} className="mr-1" /> Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full rounded-lg object-cover h-[400px]"
            />
          </div>
          
          {/* Blog Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blog-purple/20 text-blog-purple px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={blog.author?.profilePicture} alt={blog.author?.name} />
                <AvatarFallback>{blog.author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{blog.author?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{timeAgo}</p>
              </div>
            </div>
          </div>
          
          {/* Blog Content */}
          <div className="prose dark:prose-invert max-w-none mb-10">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
          
          {/* Attachments */}
          {blog.attachments && blog.attachments.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-4">Attachments</h3>
              <div className="space-y-2">
                {blog.attachments.map((attachment: string, index: number) => {
                  const fileName = attachment.split('/').pop() || `File ${index + 1}`;
                  return (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      </svg>
                      {fileName}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Interaction Bar */}
          <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 dark:border-gray-800 mb-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 ${
                  isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                <span>{likesCount}</span>
              </button>
              
              <button
                onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
              >
                <MessageSquare size={20} />
                <span>{blog.comments?.length || 0}</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBookmark}
                className={`${
                  isBookmarked ? "text-blog-purple" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
              
              <button
                onClick={handleShare}
                className="text-gray-500 dark:text-gray-400"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          {/* Comments Section */}
          <div id="comments" className="pt-4">
            <h2 className="text-2xl font-bold mb-6">Comments ({blog.comments?.length || 0})</h2>
            
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <Textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blog-purple hover:bg-blog-purple-dark text-white"
                  >
                    Post Comment
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8 text-center">
                <p className="mb-3">Please login to join the discussion</p>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-blog-purple hover:bg-blog-purple-dark text-white"
                >
                  Sign In
                </Button>
              </div>
            )}
            
            {/* Comments List */}
            <div className="space-y-8">
              {blog.comments?.length > 0 ? (
                blog.comments.map((comment: any) => (
                  <div key={comment._id} className="border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user?.profilePicture} alt={comment.user?.name} />
                        <AvatarFallback>{comment.user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{comment.user?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2">{comment.text}</p>
                        <button
                          onClick={() => setReplyingTo(comment._id)}
                          className="text-sm text-blog-purple mt-2"
                        >
                          Reply
                        </button>
                        
                        {/* Reply Form */}
                        {isAuthenticated && replyingTo === comment._id && (
                          <form
                            onSubmit={(e) => handleReplySubmit(e, comment._id)}
                            className="mt-4"
                          >
                            <Textarea
                              placeholder="Add a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                              className="mb-2 text-sm"
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                size="sm"
                                className="bg-blog-purple hover:bg-blog-purple-dark text-white"
                              >
                                Reply
                              </Button>
                            </div>
                          </form>
                        )}
                        
                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                          <div className="mt-4 ml-6 space-y-4">
                            {comment.replies.map((reply: any) => (
                              <div key={reply._id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={reply.user?.profilePicture} alt={reply.user?.name} />
                                    <AvatarFallback>{reply.user?.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="flex justify-between">
                                      <div>
                                        <p className="font-medium">{reply.user?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="mt-1 text-sm">{reply.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogView;
