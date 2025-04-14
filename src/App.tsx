
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateBlog from "@/pages/dashboard/CreateBlog";
import Profile from "@/pages/dashboard/Profile";
import BlogView from "@/pages/blog/BlogView";
import Blogs from "@/pages/Blogs";
import About from "@/pages/About";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminBlogs from "@/pages/admin/AdminBlogs";
import AdminComments from "@/pages/admin/AdminComments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="blog/:id" element={<BlogView />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="about" element={<About />} />
              
              {/* Dashboard Routes */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/create" element={<CreateBlog />} />
              <Route path="dashboard/profile" element={<Profile />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/blogs" element={<AdminBlogs />} />
              <Route path="admin/comments" element={<AdminComments />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
