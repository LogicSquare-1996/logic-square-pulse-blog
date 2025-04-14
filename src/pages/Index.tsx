
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Star,
  Filter
} from "lucide-react";

import BlogCard, { BlogPost } from "@/components/blog/BlogCard";
import BlogSlider from "@/components/blog/BlogSlider";
import { mockBlogs, mockFeaturedBlogs } from "@/utils/mockData";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [activeFilter, setActiveFilter] = useState("popular");

  useEffect(() => {
    // Check if user is authenticated
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);

    // Filter blogs based on search and active filter
    let filtered = mockBlogs;
    
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filter
    switch (activeFilter) {
      case "popular":
        filtered = [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "recent":
        filtered = [...filtered].sort((a, b) => {
          // Convert string dates to Date objects for comparison
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        break;
      case "trending":
        filtered = [...filtered].sort((a, b) => (b.comments || 0) - (a.comments || 0));
        break;
      default:
        break;
    }
    
    setFilteredBlogs(filtered);
  }, [searchTerm, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Slider */}
      <section className="w-full">
        <BlogSlider 
          blogs={mockFeaturedBlogs} 
          isAuthenticated={isAuthenticated} 
        />
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Blogs</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover insights and knowledge from Logic Square team
            </p>
          </div>
          
          {isAuthenticated && (
            <Link to="/dashboard/create">
              <Button className="mt-4 md:mt-0 bg-blog-purple hover:bg-blog-purple-dark text-white">
                Create Blog
              </Button>
            </Link>
          )}
        </div>
        
        {/* Search and Filters */}
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
              variant={activeFilter === "popular" ? "default" : "outline"}
              className={activeFilter === "popular" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}
              onClick={() => handleFilterChange("popular")}
            >
              <Star className="mr-2 h-4 w-4" /> Popular
            </Button>
            <Button
              variant={activeFilter === "recent" ? "default" : "outline"}
              className={activeFilter === "recent" ? "bg-blog-purple hover:bg-blog-purple-dark" : ""}
              onClick={() => handleFilterChange("recent")}
            >
              <Clock className="mr-2 h-4 w-4" /> Recent
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
        
        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <BlogCard 
                key={blog.id} 
                blog={blog} 
                isAuthenticated={isAuthenticated} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl font-medium mb-2">No blogs found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filter settings
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("popular");
                }}
              >
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blog-purple to-blog-purple-dark py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to share your knowledge?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join the Logic Square community to create blogs, interact with colleagues, 
            and stay updated with the latest insights.
          </p>
          {isAuthenticated ? (
            <Link to="/dashboard/create">
              <Button 
                variant="secondary"
                className="text-blog-purple font-medium px-8 py-6 text-lg"
              >
                Create Your Blog
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button 
                  variant="secondary"
                  className="text-blog-purple font-medium px-8 py-6 text-lg w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 font-medium px-8 py-6 text-lg w-full sm:w-auto"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
