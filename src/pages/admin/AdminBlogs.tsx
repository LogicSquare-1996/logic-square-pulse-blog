
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
  Star,
  Download
} from "lucide-react";
import { toast } from "sonner";

const mockBlogs = [
  {
    _id: "1",
    title: "Introduction to React Hooks",
    author: { _id: "1", name: "John Doe", profilePicture: "https://i.pravatar.cc/150?img=1" },
    createdAt: "2025-03-20T14:23:05.162Z",
    tags: ["React", "JavaScript", "Frontend"],
    likes: ["user1", "user2", "user3"],
    comments: ["comment1", "comment2"],
    featured: true,
    status: "published"
  },
  {
    _id: "2",
    title: "Building Responsive UIs with Tailwind CSS",
    author: { _id: "2", name: "Jane Smith", profilePicture: "https://i.pravatar.cc/150?img=2" },
    createdAt: "2025-03-19T09:45:12.543Z",
    tags: ["CSS", "Tailwind", "Frontend"],
    likes: ["user1", "user2"],
    comments: ["comment1", "comment2", "comment3", "comment4"],
    featured: false,
    status: "published"
  },
  {
    _id: "3",
    title: "Node.js Authentication with JWT",
    author: { _id: "3", name: "Robert Johnson", profilePicture: "https://i.pravatar.cc/150?img=3" },
    createdAt: "2025-03-18T16:30:45.123Z",
    tags: ["Node.js", "Authentication", "Backend"],
    likes: ["user1", "user2", "user3", "user4", "user5"],
    comments: ["comment1"],
    featured: false,
    status: "published"
  },
  {
    _id: "4",
    title: "MongoDB Data Modeling Best Practices",
    author: { _id: "4", name: "Emily Davis", profilePicture: "https://i.pravatar.cc/150?img=4" },
    createdAt: "2025-03-17T11:20:33.987Z",
    tags: ["MongoDB", "Database", "Backend"],
    likes: ["user1"],
    comments: [],
    featured: false,
    status: "draft"
  },
  {
    _id: "5",
    title: "Optimizing React Applications",
    author: { _id: "1", name: "John Doe", profilePicture: "https://i.pravatar.cc/150?img=1" },
    createdAt: "2025-03-16T08:15:22.654Z",
    tags: ["React", "Performance", "Frontend"],
    likes: ["user1", "user2", "user3"],
    comments: ["comment1", "comment2"],
    featured: true,
    status: "published"
  }
];

const AdminBlogs = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Check if user is admin
    if (user && user.role === "admin") {
      fetchBlogs();
    } else {
      toast.error("You don't have permission to access the admin panel");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  useEffect(() => {
    if (blogs.length > 0) {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);
  
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/admin/blogs');
      // const data = await response.json();
      // setBlogs(data.blogs);
      
      // Using mock data for now
      setTimeout(() => {
        setBlogs(mockBlogs);
        setFilteredBlogs(mockBlogs);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to load blogs");
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };
  
  const handleDeleteBlog = async (blogId) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/blogs/${blogId}`, {
      //   method: 'DELETE'
      // });
      
      // Update local state
      const updatedBlogs = blogs.filter(blog => blog._id !== blogId);
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
      
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error("Failed to delete blog");
      console.error("Error deleting blog:", error);
    }
  };
  
  const handleToggleFeatured = async (blogId, featured) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/blogs/${blogId}/feature`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ featured: !featured })
      // });
      
      // Update local state
      const updatedBlogs = blogs.map(blog => 
        blog._id === blogId ? { ...blog, featured: !featured } : blog
      );
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
      
      toast.success(featured ? "Blog removed from featured" : "Blog added to featured");
    } catch (error) {
      toast.error("Failed to update blog featured status");
      console.error("Error updating blog featured status:", error);
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
  
  const exportBlogs = () => {
    try {
      // Create CSV content
      let csvContent = "Title,Author,Date,Tags,Likes,Comments,Featured,Status\n";
      
      filteredBlogs.forEach(blog => {
        const tagsStr = blog.tags.join(', ');
        csvContent += `${blog.title},${blog.author.name},${formatDate(blog.createdAt)},${tagsStr},${blog.likes.length},${blog.comments.length},${blog.featured},${blog.status}\n`;
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "blogs.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Blogs exported successfully");
    } catch (error) {
      toast.error("Failed to export blogs");
      console.error("Error exporting blogs:", error);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Blog Management</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportBlogs}>
              <Download size={18} className="mr-2" /> Export
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search blogs by title, author, or tags..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="flex-shrink-0">
              <Filter size={18} className="mr-2" /> Filter
            </Button>
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
                      <TableHead>Blog</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell>
                          <div className="font-medium">
                            {blog.title}
                            {blog.featured && (
                              <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img 
                                src={blog.author.profilePicture} 
                                alt={blog.author.name}
                                className="h-full w-full object-cover" 
                              />
                            </div>
                            <span>{blog.author.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(blog.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-100 dark:bg-gray-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="font-semibold">{blog.likes.length}</span>
                              <span className="text-gray-500 dark:text-gray-400"> likes</span>
                            </div>
                            <div className="text-sm">
                              <span className="font-semibold">{blog.comments.length}</span>
                              <span className="text-gray-500 dark:text-gray-400"> comments</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={blog.status === "published" 
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
                            }
                          >
                            {blog.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/blog/${blog._id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Blog
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleFeatured(blog._id, blog.featured)}>
                                <Star className="mr-2 h-4 w-4" />
                                {blog.featured ? "Remove from Featured" : "Add to Featured"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteBlog(blog._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Blog
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredBlogs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No blogs found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
