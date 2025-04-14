import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogPost {
  id?: string;
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  author: {
    name: string;
    profilePicture?: string;
    avatar?: string; // Adding avatar as an alternative to profilePicture
    _id?: string;
    title?: string; // Adding title field for author
  };
  likes: number;
  comments: number;
  tags: string[];
  category?: string; // Adding category field
  rating?: number; // Adding rating field
  featured?: boolean; // Adding featured field
  views?: number; // Adding views field for completeness
}

interface BlogCardProps {
  blog: BlogPost;
  isAuthenticated: boolean;
  variant?: "default" | "compact";
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, isAuthenticated, variant = "default" }) => {
  const formattedDate = format(new Date(blog.createdAt), "MMM dd, yyyy");

  return (
    <Card className={cn(variant === "compact" ? "h-64" : "")}>
      <Link to={`/blog/${blog.id || blog._id}`}>
        <div className="relative">
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className={cn(
              "aspect-video w-full rounded-md object-cover transition-all hover:scale-105",
              variant === "compact" ? "h-32" : "h-48"
            )}
          />
          {blog.category && (
            <Badge className="absolute top-2 left-2 rounded-full px-3 py-1">
              {blog.category}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="grid gap-3 py-4">
        <Link to={`/blog/${blog.id || blog._id}`}>
          <h3 className="text-lg font-semibold line-clamp-2">{blog.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {blog.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={`/user/${blog.author._id}`}>
            <img
              src={blog.author.avatar || blog.author.profilePicture || "https://via.placeholder.com/50"}
              alt={blog.author.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          </Link>
          <div>
            <Link to={`/user/${blog.author._id}`}>
              <p className="text-sm font-medium hover:underline">{blog.author.name}</p>
            </Link>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
            <span>{blog.likes}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-4 w-4" />
            <span>{blog.comments}</span>
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
