import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Star,
  Tag
} from "lucide-react";
import BlogGrid from "@/components/blog/BlogGrid";
import { BlogPost } from "@/components/blog/BlogCard";
import api from "@/api/api";
import { mockBlogs } from "@/utils/mockData";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock data for filters
const mockTags = [
  "React", "JavaScript", "TypeScript", "Node.js", "MongoDB", 
  "Express", "AWS", "DevOps", "Testing", "UI/UX"
];

const mockCategories = [
  "Frontend", "Backend", "Full Stack", "DevOps", "Design",
  "Mobile", "Data Science", "Machine Learning", "Security", "Career"
];

const Blogs = () => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: mockBlogs.length,
    pages: Math.ceil(mockBlogs.length / 12)
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [pagination.page, activeFilter, selectedTags, selectedCategories]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs();
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const params = {
            page: pagination.page,
            limit: pagination.limit,
            sortBy: getSortParam(),
            searchQuery: searchTerm,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            categories: selectedCategories.length > 0 ? selectedCategories : undefined
          };
          
          const response = await api.blog.getBlogs(params);
          
          if (response.data && response.data.success) {
            setBlogs(response.data.blogs);
            setPagination(response.data.pagination);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching blogs from API:', error);
          // Fall back to mock data
        }
      }
      
      let filtered = [...mockBlogs];
      
      if (searchTerm) {
        filtered = filtered.filter(blog => 
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (selectedTags.length > 0) {
        filtered = filtered.filter(blog => 
          selectedTags.some(tag => blog.tags.includes(tag))
        );
      }
      
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(blog => 
          blog.category && selectedCategories.includes(blog.category)
        );
      }
      
      switch (activeFilter) {
        case "popular":
          filtered = [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0));
          break;
        case "recent":
          filtered = [...filtered].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
          break;
        case "trending":
          filtered = [...filtered].sort((a, b) => (b.comments || 0) - (a.comments || 0));
          break;
        case "rated":
          filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        default:
          filtered = [...filtered].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
      }
      
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      const paginatedBlogs = filtered.slice(start, end);
      
      setBlogs(paginatedBlogs);
      setPagination(prev => ({ 
        ...prev, 
        total: filtered.length,
        pages: Math.ceil(filtered.length / pagination.limit)
      }));
      
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const getSortParam = () => {
    switch(activeFilter) {
      case "popular":
        return "likes";
      case "recent":
        return "createdAt";
      case "trending":
        return "comments";
      case "rated":
        return "rating";
      default:
        return "createdAt";
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const toggleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const toggleCategorySelection = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilter("recent");
    setSelectedTags([]);
    setSelectedCategories([]);
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilterDialogOpen(false);
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
          
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> 
                {(selectedTags.length > 0 || selectedCategories.length > 0) ? 
                  `Filters (${selectedTags.length + selectedCategories.length})` : 
                  "More Filters"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filter Blogs</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Tag size={18} /> Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {mockTags.map(tag => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTagSelection(tag)}
                        />
                        <Label 
                          htmlFor={`tag-${tag}`}
                          className="text-sm cursor-pointer"
                        >
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-3">
                    {mockCategories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategorySelection(category)}
                        />
                        <Label 
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button onClick={() => setFilterDialogOpen(false)} className="bg-blog-purple">
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                    
                    {pagination.pages <= 5 ? (
                      [...Array(pagination.pages)].map((_, i) => (
                        <Button 
                          key={i}
                          variant={pagination.page === i + 1 ? "default" : "outline"}
                          className={pagination.page === i + 1 ? "bg-blog-purple" : ""}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      ))
                    ) : (
                      <>
                        <Button 
                          variant={pagination.page === 1 ? "default" : "outline"}
                          className={pagination.page === 1 ? "bg-blog-purple" : ""}
                          onClick={() => handlePageChange(1)}
                        >
                          1
                        </Button>
                        
                        {pagination.page > 3 && <span className="px-2 flex items-center">...</span>}
                        
                        {pagination.page !== 1 && pagination.page !== pagination.pages && (
                          <Button 
                            variant="default"
                            className="bg-blog-purple"
                          >
                            {pagination.page}
                          </Button>
                        )}
                        
                        {pagination.page < pagination.pages - 2 && <span className="px-2 flex items-center">...</span>}
                        
                        <Button 
                          variant={pagination.page === pagination.pages ? "default" : "outline"}
                          className={pagination.page === pagination.pages ? "bg-blog-purple" : ""}
                          onClick={() => handlePageChange(pagination.pages)}
                        >
                          {pagination.pages}
                        </Button>
                      </>
                    )}
                    
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
                    onClick={resetFilters}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="featured">
          <BlogGrid 
            blogs={blogs.filter(blog => blog.featured === true)} 
            isAuthenticated={isAuthenticated} 
          />
        </TabsContent>
        
        <TabsContent value="latest">
          <div className="py-8">
            <h3 className="text-xl font-medium mb-6">Latest blogs</h3>
            <BlogGrid 
              blogs={[...blogs].sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
              }).slice(0, 6)} 
              isAuthenticated={isAuthenticated} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Blogs;
