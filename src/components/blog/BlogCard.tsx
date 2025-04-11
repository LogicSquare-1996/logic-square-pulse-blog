
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
}

interface BlogCardProps {
  blog: BlogPost;
  isAuthenticated?: boolean;
}

const BlogCard = ({ blog, isAuthenticated = false }: BlogCardProps) => {
  const [isLiked, setIsLiked] = useState(blog.isLiked || false);
  const [likesCount, setLikesCount] = useState(blog.likes);
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked || false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to like this post");
      return;
    }
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to bookmark this post");
      return;
    }
    
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const timeAgo = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });

  return (
    <Link to={isAuthenticated ? `/blog/${blog.id}` : "/login"} className="group">
      <div className="blog-card bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden shadow-md">
        <div className="h-48 overflow-hidden">
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blog-purple dark:group-hover:text-blog-purple-light transition-colors">
              {blog.title}
            </h3>
            <div className="flex gap-1">
              {blog.tags.slice(0, 2).map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {blog.excerpt}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={blog.author.avatarUrl} alt={blog.author.name} />
                <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{blog.author.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-xs">{likesCount}</span>
              </button>
              
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MessageSquare size={16} />
                <span className="text-xs">{blog.comments}</span>
              </div>
              
              <button 
                onClick={handleBookmark}
                className={`${isBookmarked ? 'text-blog-purple' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
            <Button className="bg-blog-purple hover:bg-blog-purple-dark text-white">
              Sign in to read
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;
