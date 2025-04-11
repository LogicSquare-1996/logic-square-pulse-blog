
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Facebook, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Login = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return email.endsWith("@logic-square.com");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Only @logic-square.com email domains are allowed");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      localStorage.setItem("isLoggedIn", "true");
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login feature will be implemented soon");
  };

  const handleFacebookLogin = () => {
    toast.info("Facebook login feature will be implemented soon");
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Image (hidden on mobile) */}
        {!isMobile && (
          <div className="w-1/2 bg-blog-purple relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blog-purple to-blog-purple-dark opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
                <p className="text-lg text-white/80 mb-8">
                  Share your knowledge and insights with the Logic Square community
                </p>
                <img 
                  src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Blogging" 
                  className="mx-auto max-w-[80%] rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Right Side - Form */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-8 sm:p-12`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Login to access your dashboard
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@logic-square.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 dark:border-gray-600 focus:border-blog-purple dark:focus:border-blog-purple-light"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-blog-purple dark:text-blog-purple-light hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-300 dark:border-gray-600 focus:border-blog-purple dark:focus:border-blog-purple-light"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blog-purple hover:bg-blog-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
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
                onClick={handleGoogleLogin}
                className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Mail className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button 
                variant="outline"
                onClick={handleFacebookLogin}
                className="border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blog-purple dark:text-blog-purple-light font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
