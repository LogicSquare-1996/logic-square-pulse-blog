
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageSquare, 
  Bookmark,
  Clock,
  User
} from "lucide-react";
import { toast } from "sonner";
import * as blogApi from "@/api/blog";

export interface BlogPost {
  id?: string;
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  thumbnailUrl?: string;
  author: {
    name: string;
    profilePicture?: string;
    _id?: string;
  };
  createdAt: string;
  tags?: string[];
  likes?: number | any[];
  comments?: number | any[];
  readTime?: string;
}

interface BlogCardProps {
  blog: BlogPost;
  isAuthenticated?: boolean;
  variant?: "default" | "horizontal";
}

const BlogCard = ({ blog, isAuthenticated = false, variant = "default" }: BlogCardProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const blogId = blog._id || blog.id;
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to like blogs");
      return;
    }
    
    try {
      await blogApi.likeBlog(blogId as string);
      setLiked(prev => !prev);
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };
  
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to bookmark blogs");
      return;
    }
    
    try {
      await blogApi.bookmarkBlog(blogId as string);
      setBookmarked(prev => !prev);
      toast.success(bookmarked ? "Blog removed from bookmarks" : "Blog added to bookmarks");
    } catch (error) {
      console.error("Error bookmarking blog:", error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  
  const getLikesCount = () => {
    if (typeof blog.likes === 'number') {
      return blog.likes;
    }
    return blog.likes?.length || 0;
  };
  
  const getCommentsCount = () => {
    if (typeof blog.comments === 'number') {
      return blog.comments;
    }
    return blog.comments?.length || 0;
  };
  
  if (variant === "horizontal") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <Link to={`/blog/${blogId}`}>
              <div className="h-48 md:h-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                {blog.thumbnailUrl ? (
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </Link>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{blog.author.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                
                <Link to={`/blog/${blogId}`}>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight hover:text-blog-purple transition-colors">
                    {blog.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {blog.excerpt}
                </p>
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
                  onClick={handleLike}
                >
                  <Heart size={18} className={liked ? "fill-current" : ""} />
                  <span>{getLikesCount()}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-1"
                  asChild
                >
                  <Link to={`/blog/${blogId}#comments`}>
                    <MessageSquare size={18} />
                    <span>{getCommentsCount()}</span>
                  </Link>
                </Button>
              </div>
              
              {isAuthenticated && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={bookmarked ? "text-blog-purple" : ""}
                  onClick={handleBookmark}
                >
                  <Bookmark size={18} className={bookmarked ? "fill-current" : ""} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/blog/${blogId}`}>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          {blog.thumbnailUrl ? (
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{blog.author.name}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </div>
        
        <Link to={`/blog/${blogId}`}>
          <h3 className="mt-2 text-xl font-bold leading-tight hover:text-blog-purple transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>
        
        <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
          {blog.excerpt}
        </p>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                +{blog.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart size={18} className={liked ? "fill-current" : ""} />
            <span>{getLikesCount()}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link to={`/blog/${blogId}#comments`}>
              <MessageSquare size={18} />
              <span>{getCommentsCount()}</span>
            </Link>
          </Button>
        </div>
        
        {isAuthenticated && (
          <Button 
            variant="ghost" 
            size="icon"
            className={bookmarked ? "text-blog-purple" : ""}
            onClick={handleBookmark}
          >
            <Bookmark size={18} className={bookmarked ? "fill-current" : ""} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
