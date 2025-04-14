
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MessageSquare, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "./BlogCard";

interface BlogSliderProps {
  blogs: BlogPost[];
  isAuthenticated: boolean;
}

const BlogSlider = ({ blogs, isAuthenticated }: BlogSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  }, [blogs.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length);
  }, [blogs.length]);

  useEffect(() => {
    // Auto-rotate carousel every 5 seconds
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [handleNext]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Render dots for pagination
  const renderDots = () => {
    return (
      <div className="flex justify-center gap-2 mt-4">
        {blogs.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? "w-6 bg-blog-purple" 
                : "w-2 bg-gray-300 dark:bg-gray-700"
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="h-[560px] md:h-[640px] overflow-hidden relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
        
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <div className="relative w-full h-full">
              {/* Background image with filter */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="w-full h-full transform scale-110 blur-sm"
                  style={{
                    backgroundImage: `url(${blogs[currentIndex].thumbnailUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              
              {/* Content */}
              <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
                <div className="max-w-3xl mt-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <p className="text-white/80 mb-2 flex items-center text-sm">
                      <Clock size={14} className="mr-1" />
                      {formatDate(blogs[currentIndex].createdAt)}
                      <span className="mx-2">•</span>
                      {blogs[currentIndex].category || "Uncategorized"}
                    </p>
                  </motion.div>
                  
                  <motion.h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {blogs[currentIndex].title}
                  </motion.h1>
                  
                  <motion.p 
                    className="text-lg text-white/90 mb-6 max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {blogs[currentIndex].excerpt}
                  </motion.p>
                  
                  <motion.div
                    className="flex items-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <img
                      src={blogs[currentIndex].author.profilePicture || blogs[currentIndex].author.avatar || "https://via.placeholder.com/40"}
                      alt={blogs[currentIndex].author.name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <span className="block text-white font-medium">
                        {blogs[currentIndex].author.name}
                      </span>
                      <span className="text-white/80 text-sm">
                        {blogs[currentIndex].author.title || "Author"}
                      </span>
                    </div>
                    <div className="flex ml-auto gap-4">
                      <span className="flex items-center text-white/80">
                        <Heart size={16} className="mr-1" />
                        {blogs[currentIndex].likes}
                      </span>
                      <span className="flex items-center text-white/80">
                        <MessageSquare size={16} className="mr-1" />
                        {blogs[currentIndex].comments}
                      </span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="flex flex-wrap gap-2 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    {blogs[currentIndex].tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white/10 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <Link to={`/blog/${blogs[currentIndex].id}`}>
                      <Button className="bg-blog-purple hover:bg-blog-purple-dark text-white">
                        Read Article
                      </Button>
                    </Link>
                    
                    {isAuthenticated && (
                      <Button variant="outline" className="ml-3 text-white border-white hover:bg-white/10">
                        Bookmark
                      </Button>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="absolute z-30 flex justify-between w-full top-1/2 transform -translate-y-1/2 px-4">
          <Button
            onClick={handlePrev}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={handleNext}
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Dots indicator */}
      <div className="container mx-auto px-4 relative -mt-6 z-20">
        {renderDots()}
      </div>
    </div>
  );
};

export default BlogSlider;
