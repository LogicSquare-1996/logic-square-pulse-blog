
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlogPost } from "./BlogCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogSliderProps {
  blogs: BlogPost[];
  isAuthenticated?: boolean;
}

const BlogSlider = ({ blogs, isAuthenticated = false }: BlogSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === blogs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentIndex]);

  if (!blogs || !blogs.length) return null;

  const currentBlog = blogs[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
      {/* Navigation Buttons */}
      <button
        onClick={() => {
          handlePrev();
          stopAutoPlay();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 dark:hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={() => {
          handleNext();
          stopAutoPlay();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 dark:hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slides */}
      <div className="h-full w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Image with gradient overlay */}
            <div className="relative h-full">
              <img
                src={currentBlog.thumbnailUrl}
                alt={currentBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-12 md:pb-16">
                <motion.div 
                  className="max-w-4xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img 
                        src={currentBlog.author.avatarUrl} 
                        alt={currentBlog.author.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-white">{currentBlog.author.name}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-white">
                    {currentBlog.title}
                  </h2>
                  
                  <p className="text-sm md:text-base text-gray-200 mb-6 max-w-2xl">
                    {currentBlog.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentBlog.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="bg-blog-purple/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link to={isAuthenticated ? `/blog/${currentBlog.id || currentBlog._id}` : "/login"}>
                    <Button className="bg-blog-purple hover:bg-blog-purple-dark text-white">
                      {isAuthenticated ? "Read More" : "Sign in to Read"}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {blogs.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
              stopAutoPlay();
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white scale-125" 
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogSlider;
