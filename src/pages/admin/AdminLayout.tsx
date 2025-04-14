
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Tag, 
  BarChart, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    { path: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/users", icon: <Users size={20} />, label: "Users" },
    { path: "/admin/blogs", icon: <BookOpen size={20} />, label: "Blogs" },
    { path: "/admin/comments", icon: <MessageSquare size={20} />, label: "Comments" },
    { path: "/admin/tags", icon: <Tag size={20} />, label: "Tags" },
    { path: "/admin/reports", icon: <BarChart size={20} />, label: "Reports" },
  ];
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
        <Button variant="ghost" onClick={toggleSidebar} className="px-2">
          <Menu size={24} />
        </Button>
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="w-8"></div> {/* Empty div for flex alignment */}
      </div>
      
      {/* Sidebar (mobile overlay) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-lg transition-transform transform z-50 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-blog-purple">Logic</span>
            <span>Square</span>
          </Link>
          <Button 
            variant="ghost" 
            onClick={toggleSidebar} 
            className="md:hidden px-1"
          >
            <X size={20} />
          </Button>
        </div>
        
        <Separator />
        
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Logged in as</p>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
        
        <Separator />
        
        <nav className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 my-1 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "bg-blog-purple text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Separator className="mb-4" />
          <div className="flex justify-between">
            <Link 
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-blog-purple dark:hover:text-blog-purple transition-colors"
            >
              View Site
            </Link>
            <Button 
              variant="ghost" 
              className="text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-500 p-0"
              onClick={logout}
            >
              <LogOut size={18} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="md:ml-64 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
