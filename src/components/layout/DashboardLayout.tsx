
import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LayoutDashboard,
  User,
  Settings,
  BookmarkIcon,
  History,
  LogOut,
  PlusCircle
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || 
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dashboard Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                to="/"
                className="text-2xl font-bold text-blog-purple dark:text-blog-purple-light mr-8"
              >
                Logic<span className="text-gray-600 dark:text-gray-300">Square</span>
              </Link>
              
              {!isMobile && (
                <nav className="hidden md:flex space-x-6">
                  <Link to="/dashboard" className="text-gray-700 hover:text-blog-purple dark:text-gray-300 dark:hover:text-blog-purple-light">Dashboard</Link>
                  <Link to="/" className="text-gray-700 hover:text-blog-purple dark:text-gray-300 dark:hover:text-blog-purple-light">Browse Blogs</Link>
                </nav>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between py-4 border-b">
                        <Link to="/" className="text-xl font-bold">
                          Logic<span className="text-gray-600 dark:text-gray-400">Square</span>
                        </Link>
                        <button
                          onClick={toggleDarkMode}
                          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                          aria-label="Toggle Dark Mode"
                        >
                          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                      </div>
                      
                      <div className="py-4 border-b">
                        <div className="flex items-center space-x-3 mb-6">
                          <Avatar>
                            <AvatarImage src={user?.profilePicture} alt={user?.name} />
                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <nav className="flex flex-col space-y-1 py-4">
                        <Link 
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <LayoutDashboard size={18} />
                          <span>Dashboard</span>
                        </Link>
                        <Link 
                          to="/dashboard/create"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <PlusCircle size={18} />
                          <span>Create Blog</span>
                        </Link>
                        <Link 
                          to="/dashboard/profile"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <User size={18} />
                          <span>Profile</span>
                        </Link>
                        <Link 
                          to="/dashboard/bookmarks"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <BookmarkIcon size={18} />
                          <span>Bookmarks</span>
                        </Link>
                        <Link 
                          to="/dashboard/history"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <History size={18} />
                          <span>History</span>
                        </Link>
                        <Link 
                          to="/dashboard/settings"
                          className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                      </nav>
                      
                      <div className="mt-auto border-t py-4">
                        <Button 
                          variant="ghost" 
                          className="flex items-center space-x-2 w-full justify-start px-4"
                          onClick={() => {
                            logout();
                            navigate("/login");
                          }}
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <div className="relative">
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.profilePicture} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
