
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BlogPost } from "./BlogCard";

interface BlogSliderProps {
  blogs: BlogPost[];
  isAuthenticated: boolean;
}

const BlogSlider = ({ blogs, isAuthenticated }: BlogSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === blogs.length - 1 ? 0 : prev + 1));
  };

  const handlePreviousSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? blogs.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Autoplay functionality
    if (!isPaused) {
      slideTimerRef.current = setInterval(() => {
        handleNextSlide();
      }, 5000);
    }

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [isPaused, activeSlide, blogs.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pauseSlider = () => {
    setIsPaused(true);
  };

  const resumeSlider = () => {
    setIsPaused(false);
  };

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"
      onMouseEnter={pauseSlider}
      onMouseLeave={resumeSlider}
    >
      {/* Background Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${activeSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url(${blogs[activeSlide].thumbnailUrl || '/placeholder.svg'})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(15px)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

      <div className="container mx-auto h-full relative z-20 flex items-center">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              {/* Left Content (Text) */}
              <div className="text-white p-4">
                <div className="mb-4 flex flex-wrap gap-2">
                  {blogs[activeSlide].tags?.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blog-purple/20 text-blog-purple-light px-2 py-1 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.h1 
                  className="text-3xl md:text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {blogs[activeSlide].title}
                </motion.h1>
                
                <motion.p 
                  className="text-gray-300 mb-6 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {blogs[activeSlide].excerpt}
                </motion.p>

                <motion.div 
                  className="flex items-center space-x-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-400">
                    {blogs[activeSlide].author.profilePicture ? (
                      <img
                        src={blogs[activeSlide].author.profilePicture}
                        alt={blogs[activeSlide].author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-800">
                        {blogs[activeSlide].author.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{blogs[activeSlide].author.name}</p>
                    <p className="text-sm text-gray-400">{formatDate(blogs[activeSlide].createdAt)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link to={`/blog/${blogs[activeSlide]._id || blogs[activeSlide].id}`}>
                    <Button className="bg-blog-purple hover:bg-blog-purple-dark text-white">
                      Read Post
                    </Button>
                  </Link>
                </motion.div>
              </div>
              
              {/* Right Content (Image) */}
              <div className="hidden md:block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="relative rounded-lg shadow-2xl overflow-hidden h-[350px]"
                >
                  <img
                    src={blogs[activeSlide].thumbnailUrl || '/placeholder.svg'}
                    alt={blogs[activeSlide].title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Navigation Buttons */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 md:justify-start md:left-8 z-30">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white rounded-full hover:bg-white/20"
              onClick={handlePreviousSlide}
            >
              <ChevronLeft />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white rounded-full hover:bg-white/20"
              onClick={handleNextSlide}
            >
              <ChevronRight />
            </Button>
          </div>

          {/* Indicator Dots */}
          <div className="absolute bottom-8 right-8 hidden md:flex space-x-2">
            {blogs.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === activeSlide ? "w-8 bg-blog-purple" : "w-2 bg-white/30"
                }`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSlider;
