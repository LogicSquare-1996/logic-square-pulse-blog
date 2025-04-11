
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Facebook, Mail, User, Briefcase } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Signup = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobTitle: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    return email.endsWith("@logic-square.com");
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword, jobTitle } = formData;
    
    if (!name || !email || !password || !confirmPassword || !jobTitle) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Only @logic-square.com email domains are allowed");
      return;
    }
    
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful signup
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-8 sm:p-12`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join the Logic Square blogging community
            </p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@logic-square.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Only @logic-square.com emails are allowed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Software Engineer"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 8 characters</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blog-purple hover:bg-blog-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Mail className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blog-purple dark:text-blog-purple-light font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        {/* Right Side - Image (hidden on mobile) */}
        {!isMobile && (
          <div className="w-1/2 bg-blog-purple-dark relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-l from-blog-purple to-blog-purple-dark opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-6">Join Our Community!</h2>
                <p className="text-lg text-white/80 mb-8">
                  Create and share insightful blogs with your colleagues at Logic Square
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Blogging" 
                  className="mx-auto max-w-[80%] rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
