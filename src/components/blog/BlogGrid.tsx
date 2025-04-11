
import { BlogPost } from "./BlogCard";
import BlogCard from "./BlogCard";

interface BlogGridProps {
  blogs: BlogPost[];
  isAuthenticated?: boolean;
}

const BlogGrid = ({ blogs, isAuthenticated = false }: BlogGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard 
          key={blog.id || blog._id} 
          blog={blog} 
          isAuthenticated={isAuthenticated} 
        />
      ))}
    </div>
  );
};

export default BlogGrid;
