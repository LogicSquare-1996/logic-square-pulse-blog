
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, Bars, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, BookOpen, MessageSquare, TrendingUp, Award, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const mockStats = {
  totalUsers: 42,
  totalBlogs: 87,
  totalComments: 164,
  newUsersThisWeek: 5,
  newBlogsThisWeek: 12,
  activeUsers: 28,
  flaggedContent: 3,
  weeklyActivity: [
    { day: "Mon", blogs: 3, comments: 8, users: 2 },
    { day: "Tue", blogs: 5, comments: 12, users: 4 },
    { day: "Wed", blogs: 2, comments: 6, users: 1 },
    { day: "Thu", blogs: 7, comments: 14, users: 3 },
    { day: "Fri", blogs: 4, comments: 10, users: 2 },
    { day: "Sat", blogs: 1, comments: 4, users: 1 },
    { day: "Sun", blogs: 2, comments: 5, users: 0 }
  ],
  monthlyBlogs: [
    { month: "Jan", count: 8 },
    { month: "Feb", count: 12 },
    { month: "Mar", count: 15 },
    { month: "Apr", count: 10 },
    { month: "May", count: 14 },
    { month: "Jun", count: 18 },
    { month: "Jul", count: 20 },
    { month: "Aug", count: 17 },
    { month: "Sep", count: 21 },
    { month: "Oct", count: 15 },
    { month: "Nov", count: 19 },
    { month: "Dec", count: 22 }
  ],
  topContributors: [
    { name: "John Doe", blogs: 12, comments: 34, likes: 87 },
    { name: "Jane Smith", blogs: 8, comments: 45, likes: 72 },
    { name: "Alice Johnson", blogs: 15, comments: 28, likes: 93 },
    { name: "Bob Williams", blogs: 6, comments: 56, likes: 45 },
    { name: "Charlie Brown", blogs: 10, comments: 32, likes: 68 }
  ]
};

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [timeRange, setTimeRange] = useState("weekly");
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Check if user is admin
    if (user && user.role === "admin") {
      setIsAdmin(true);
      fetchDashboardStats();
    } else {
      toast.error("You don't have permission to access the admin panel");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/admin/dashboard/stats');
      // const data = await response.json();
      // setStats(data);
      
      // Using mock data for now
      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
      console.error("Error fetching dashboard stats:", error);
      setLoading(false);
    }
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
                </div>
                <Users className="h-8 w-8 text-blog-purple" />
              </div>
              <p className="text-xs text-green-600 mt-2">+{stats.newUsersThisWeek} this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Blogs</p>
                  <h3 className="text-3xl font-bold">{stats.totalBlogs}</h3>
                </div>
                <BookOpen className="h-8 w-8 text-blog-purple" />
              </div>
              <p className="text-xs text-green-600 mt-2">+{stats.newBlogsThisWeek} this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
                  <h3 className="text-3xl font-bold">{stats.totalComments}</h3>
                </div>
                <MessageSquare className="h-8 w-8 text-blog-purple" />
              </div>
              <p className="text-xs text-green-600 mt-2">Active discussions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Flagged Content</p>
                  <h3 className="text-3xl font-bold">{stats.flaggedContent}</h3>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-xs text-red-600 mt-2">Requires attention</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <Tabs defaultValue="weekly">
                <TabsList className="mb-4">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weekly">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.weeklyActivity} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="blogs" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="users" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
                
                <TabsContent value="monthly">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthlyBlogs} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bars dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div className="flex items-center gap-2">
                      {index < 3 && <Award className="h-5 w-5 text-yellow-500" />}
                      <span className="font-medium">{contributor.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-semibold">{contributor.blogs}</span>
                        <span className="text-gray-500 dark:text-gray-400"> blogs</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">{contributor.comments}</span>
                        <span className="text-gray-500 dark:text-gray-400"> comments</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">{contributor.likes}</span>
                        <span className="text-gray-500 dark:text-gray-400"> likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
