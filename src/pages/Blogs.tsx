
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Star
} from "lucide-react";
import BlogGrid from "@/components/blog/BlogGrid";
import * as blogApi from "@/api/blog";
import { BlogPost } from "@/components/blog/BlogCard";

const Blogs = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
    
    fetchBlogs();
  }, [pagination.page, activeFilter]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs();
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
      case "rated":
        return "-rating";
      default:
        return "-createdAt";
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Explore Blogs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover insights and knowledge from Logic Square team
          </p>
        </div>
      </div>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
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
            variant="outline"
          >
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-3 mb-6 bg-transparent">
          <TabsTrigger value="all" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
            All Blogs
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
            Featured
          </TabsTrigger>
          <TabsTrigger value="latest" className="data-[state=active]:bg-blog-purple data-[state=active]:text-white">
            Latest
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <BlogGrid blogs={blogs} isAuthenticated={isAuthenticated} />
              
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
        
        <TabsContent value="featured">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">Featured blogs coming soon</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Our editors are curating the best content for you
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="latest">
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">Latest blogs</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Stay updated with the newest content
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Blogs;
