
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "./AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Flag
} from "lucide-react";
import { toast } from "sonner";

const mockComments = [
  {
    _id: "1",
    blogId: "1",
    blogTitle: "Introduction to React Hooks",
    user: { _id: "1", name: "John Doe", profilePicture: "https://i.pravatar.cc/150?img=1" },
    text: "Great article! Very helpful for beginners.",
    createdAt: "2025-03-21T14:23:05.162Z",
    replies: ["reply1", "reply2"],
    flagged: false
  },
  {
    _id: "2",
    blogId: "2",
    blogTitle: "Building Responsive UIs with Tailwind CSS",
    user: { _id: "2", name: "Jane Smith", profilePicture: "https://i.pravatar.cc/150?img=2" },
    text: "I've been using Tailwind for a year now, and I agree with all your points. It really speeds up development.",
    createdAt: "2025-03-20T09:45:12.543Z",
    replies: [],
    flagged: false
  },
  {
    _id: "3",
    blogId: "3",
    blogTitle: "Node.js Authentication with JWT",
    user: { _id: "3", name: "Robert Johnson", profilePicture: "https://i.pravatar.cc/150?img=3" },
    text: "You should also mention refresh tokens for better security!",
    createdAt: "2025-03-19T16:30:45.123Z",
    replies: ["reply1"],
    flagged: false
  },
  {
    _id: "4",
    blogId: "5",
    blogTitle: "Optimizing React Applications",
    user: { _id: "4", name: "Emily Davis", profilePicture: "https://i.pravatar.cc/150?img=4" },
    text: "This is a spam comment with inappropriate content that should be removed.",
    createdAt: "2025-03-18T11:20:33.987Z",
    replies: [],
    flagged: true
  },
  {
    _id: "5",
    blogId: "1",
    blogTitle: "Introduction to React Hooks",
    user: { _id: "5", name: "Michael Brown", profilePicture: "https://i.pravatar.cc/150?img=5" },
    text: "I found a typo in the useEffect example. The dependency array is missing a variable.",
    createdAt: "2025-03-17T08:15:22.654Z",
    replies: ["reply1", "reply2", "reply3"],
    flagged: false
  }
];

const AdminComments = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComments, setFilteredComments] = useState([]);
  const [filter, setFilter] = useState("all"); // all, flagged
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Check if user is admin
    if (user && user.role === "admin") {
      fetchComments();
    } else {
      toast.error("You don't have permission to access the admin panel");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  useEffect(() => {
    if (comments.length > 0) {
      let filtered = comments;
      
      // Apply text search
      if (searchTerm) {
        filtered = filtered.filter(
          (comment) =>
            comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply flag filter
      if (filter === "flagged") {
        filtered = filtered.filter(comment => comment.flagged);
      }
      
      setFilteredComments(filtered);
    }
  }, [searchTerm, filter, comments]);
  
  const fetchComments = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/admin/comments');
      // const data = await response.json();
      // setComments(data.comments);
      
      // Using mock data for now
      setTimeout(() => {
        setComments(mockComments);
        setFilteredComments(mockComments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to load comments");
      console.error("Error fetching comments:", error);
      setLoading(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/comments/${commentId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComments);
      
      // Update filtered comments
      let filtered = updatedComments;
      if (searchTerm) {
        filtered = filtered.filter(
          (comment) =>
            comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filter === "flagged") {
        filtered = filtered.filter(comment => comment.flagged);
      }
      setFilteredComments(filtered);
      
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Error deleting comment:", error);
    }
  };
  
  const toggleFlagged = async (commentId, flagged) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/comments/${commentId}/flag`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ flagged: !flagged })
      // });
      
      // Update local state
      const updatedComments = comments.map(comment => 
        comment._id === commentId ? { ...comment, flagged: !flagged } : comment
      );
      setComments(updatedComments);
      
      // Update filtered comments
      let filtered = updatedComments;
      if (searchTerm) {
        filtered = filtered.filter(
          (comment) =>
            comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filter === "flagged") {
        filtered = filtered.filter(comment => comment.flagged);
      }
      setFilteredComments(filtered);
      
      toast.success(flagged ? "Comment unflagged" : "Comment flagged");
    } catch (error) {
      toast.error("Failed to update comment flag status");
      console.error("Error updating comment flag status:", error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Comment Moderation</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search comments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"}
                className={filter === "all" ? "bg-blog-purple" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "flagged" ? "default" : "outline"}
                className={filter === "flagged" ? "bg-red-500" : ""}
                onClick={() => setFilter("flagged")}
              >
                <Flag size={18} className="mr-2" /> Flagged
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blog-purple"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Blog</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Replies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComments.map((comment) => (
                      <TableRow key={comment._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img 
                                src={comment.user.profilePicture} 
                                alt={comment.user.name}
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <span>{comment.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {truncateText(comment.text)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            <a 
                              href={`/blog/${comment.blogId}`} 
                              className="hover:text-blog-purple hover:underline"
                            >
                              {comment.blogTitle}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(comment.createdAt)}</TableCell>
                        <TableCell>
                          <span className="font-medium">{comment.replies.length}</span>
                        </TableCell>
                        <TableCell>
                          {comment.flagged && (
                            <Badge 
                              className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                            >
                              Flagged
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/blog/${comment.blogId}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View in Blog
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleFlagged(comment._id, comment.flagged)}>
                                <Flag className="mr-2 h-4 w-4" />
                                {comment.flagged ? "Remove Flag" : "Flag Comment"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Comment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredComments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No comments found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminComments;
