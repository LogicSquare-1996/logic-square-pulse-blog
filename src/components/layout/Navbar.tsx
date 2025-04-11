
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Search,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoggedIn?: boolean;
}

const Navbar = ({ isDarkMode, toggleDarkMode, isLoggedIn = false }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for transparent/solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/"
              className="text-2xl font-bold text-blog-purple dark:text-blog-purple-light"
            >
              Logic<span className="text-gray-600 dark:text-gray-300">Square</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-8">
              <div className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blog-purple dark:text-gray-300 dark:hover:text-blog-purple-light">Home</Link>
                <Link to="/blogs" className="text-gray-700 hover:text-blog-purple dark:text-gray-300 dark:hover:text-blog-purple-light">Blogs</Link>
                <Link to="/about" className="text-gray-700 hover:text-blog-purple dark:text-gray-300 dark:hover:text-blog-purple-light">About</Link>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                  aria-label="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                  <Search size={20} />
                </button>

                {isLoggedIn ? (
                  <Link to="/dashboard">
                    <Button variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-800">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-blog-purple hover:bg-blog-purple-dark text-white">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <div className="flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button 
                onClick={toggleMenu} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-background dark:bg-gray-900 z-50 animate-fade-in">
            <div className="flex flex-col items-center pt-10 space-y-6">
              <Link 
                to="/" 
                className="text-xl font-medium text-gray-700 dark:text-gray-300"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link 
                to="/blogs" 
                className="text-xl font-medium text-gray-700 dark:text-gray-300"
                onClick={toggleMenu}
              >
                Blogs
              </Link>
              <Link 
                to="/about" 
                className="text-xl font-medium text-gray-700 dark:text-gray-300"
                onClick={toggleMenu}
              >
                About
              </Link>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-3/4 flex justify-center">
                {isLoggedIn ? (
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button className="w-full bg-blog-purple hover:bg-blog-purple-dark text-white">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login" onClick={toggleMenu}>
                    <Button className="w-full bg-blog-purple hover:bg-blog-purple-dark text-white">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
