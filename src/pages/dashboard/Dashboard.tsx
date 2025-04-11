
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Star,
  Plus
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BlogCard from "@/components/blog/BlogCard";
import BlogGrid from "@/components/blog/BlogGrid";
import { useAuth } from "@/context/AuthContext";
import * as blogApi from "@/api/blog";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getBlogs({
        page: pagination.page,
        limit: pagination.limit,
        sort: getSortParam(),
        search: searchTerm
      });
      
      setBlogs(response.blogs);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = () => {
    switch(activeFilter) {
      case "popular":
        return "-likes.length";
      case "recent":
        return "-createdAt";
      case "trending":
        return "-comments.length";
      case "oldest":
        return "createdAt";
      case "rated":
        return "-rating";
      default:
        return "-createdAt";
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    fetchBlogs();
  }, [isAuthenticated, pagination.page, activeFilter, navigate]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs();
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name}
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/dashboard/create")}
            className="mt-4 md:mt-0 bg-blog-purple hover:bg-blog-purple-dark text-white gap-2"
          >
            <Plus size={18} />
            Create Blog
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-4 md:flex md:justify-start mb-6 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
              All Blogs
            </TabsTrigger>
            <TabsTrigger value="my" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
              My Blogs
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
              History
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search blogs, authors, tags..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-auto pb-2">
              <Button
                variant={activeFilter === "recent" ? "default" : "outline"}
                className={activeFilter === "recent" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}
                onClick={() => handleFilterChange("recent")}
              >
                <Clock className="mr-2 h-4 w-4" /> Recent
              </Button>
              <Button
                variant={activeFilter === "popular" ? "default" : "outline"}
                className={activeFilter === "popular" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}
                onClick={() => handleFilterChange("popular")}
              >
                <Star className="mr-2 h-4 w-4" /> Popular
              </Button>
              <Button
                variant={activeFilter === "trending" ? "default" : "outline"}
                className={activeFilter === "trending" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}
                onClick={() => handleFilterChange("trending")}
              >
                <TrendingUp className="mr-2 h-4 w-4" /> Trending
              </Button>
              <Button
                variant={activeFilter === "rated" ? "default" : "outline"}
                className={activeFilter === "rated" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}
                onClick={() => handleFilterChange("rated")}
              >
                <Star className="mr-2 h-4 w-4" /> Top Rated
              </Button>
              <Button
                variant="outline"
              >
                <Filter className="mr-2 h-4 w-4" /> More Filters
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                className={`w-12 ${viewMode === "grid" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                className={`w-12 ${viewMode === "list" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="21" y1="18" x2="3" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <BlogGrid blogs={blogs} isAuthenticated={true} />
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <BlogCard 
                        key={blog._id} 
                        blog={blog} 
                        isAuthenticated={true} 
                        variant="horizontal" 
                      />
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      
                      {[...Array(pagination.pages)].map((_, i) => (
                        <Button 
                          key={i}
                          variant={pagination.page === i + 1 ? "default" : "outline"}
                          className={pagination.page === i + 1 ? "bg-blog-purple" : ""}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      
                      <Button 
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                
                {blogs.length === 0 && (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium mb-2">No blogs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Try adjusting your search or filter settings
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm("");
                        setActiveFilter("recent");
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                    >
                      Reset filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="my">
            <MyBlogs userId={user?._id ?? ""} viewMode={viewMode} />
          </TabsContent>
          
          <TabsContent value="bookmarks">
            <BookmarkedBlogs viewMode={viewMode} />
          </TabsContent>
          
          <TabsContent value="history">
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">History feature coming soon</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're working on implementing a reading history feature
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const MyBlogs = ({ userId, viewMode }: { userId: string, viewMode: string }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserBlogs = async () => {
      setLoading(true);
      try {
        const response = await blogApi.getUserBlogs(userId);
        setBlogs(response.blogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserBlogs();
    }
  }, [userId]);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">You haven't created any blogs yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start sharing your knowledge with the Logic Square community
        </p>
        <Button 
          className="bg-blog-purple hover:bg-blog-purple-dark text-white"
          onClick={() => window.location.href = "/dashboard/create"}
        >
          Create Your First Blog
        </Button>
      </div>
    );
  }
  
  return viewMode === "grid" ? (
    <BlogGrid blogs={blogs} isAuthenticated={true} />
  ) : (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <BlogCard 
          key={blog._id} 
          blog={blog} 
          isAuthenticated={true} 
          variant="horizontal" 
        />
      ))}
    </div>
  );
};

const BookmarkedBlogs = ({ viewMode }: { viewMode: string }) => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookmarkedBlogs = async () => {
      setLoading(true);
      try {
        const bookmarkedBlogs = await blogApi.getBookmarkedBlogs();
        setBlogs(bookmarkedBlogs);
      } catch (error) {
        console.error("Error fetching bookmarked blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarkedBlogs();
  }, []);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">No bookmarked blogs</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Bookmark your favorite blogs to read them later
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.href = "/"}
        >
          Browse Blogs
        </Button>
      </div>
    );
  }
  
  return viewMode === "grid" ? (
    <BlogGrid blogs={blogs} isAuthenticated={true} />
  ) : (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <BlogCard 
          key={blog._id} 
          blog={blog} 
          isAuthenticated={true} 
          variant="horizontal" 
        />
      ))}
    </div>
  );
};

export default Dashboard;
