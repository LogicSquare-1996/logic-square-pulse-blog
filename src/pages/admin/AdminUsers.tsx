
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminLayout from "./AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Download
} from "lucide-react";
import { toast } from "sonner";

const mockUsers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@logic-square.com",
    role: "admin",
    createdAt: "2025-03-10T14:23:05.162Z",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    blogsCount: 12
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@logic-square.com",
    role: "user",
    createdAt: "2025-03-12T09:45:12.543Z",
    profilePicture: "https://i.pravatar.cc/150?img=2",
    blogsCount: 8
  },
  {
    _id: "3",
    name: "Robert Johnson",
    email: "robert@logic-square.com",
    role: "user",
    createdAt: "2025-03-15T16:30:45.123Z",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    blogsCount: 5
  },
  {
    _id: "4",
    name: "Emily Davis",
    email: "emily@logic-square.com",
    role: "user",
    createdAt: "2025-03-18T11:20:33.987Z",
    profilePicture: "https://i.pravatar.cc/150?img=4",
    blogsCount: 15
  },
  {
    _id: "5",
    name: "Michael Brown",
    email: "michael@logic-square.com",
    role: "user",
    createdAt: "2025-03-20T08:15:22.654Z",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    blogsCount: 3
  }
];

const AdminUsers = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Check if user is admin
    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      toast.error("You don't have permission to access the admin panel");
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data.users);
      
      // Using mock data for now
      setTimeout(() => {
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/admin/user/${userId}/role`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role: newRole })
      // });
      
      // Update local state
      const updatedUsers = users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Error updating user role:", error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  const exportUsers = () => {
    try {
      // Create CSV content
      let csvContent = "Name,Email,Role,Created Date,Blogs Count\n";
      
      filteredUsers.forEach(user => {
        csvContent += `${user.name},${user.email},${user.role},${formatDate(user.createdAt)},${user.blogsCount}\n`;
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "users.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
      console.error("Error exporting users:", error);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">User Management</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportUsers}>
              <Download size={18} className="mr-2" /> Export
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button variant="outline" className="flex-shrink-0">
              <Filter size={18} className="mr-2" /> Filter
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blog-purple"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Blogs</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <img 
                                src={user.profilePicture} 
                                alt={user.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "admin" 
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100" 
                                : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>{user.blogsCount}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/user/${user._id}`)}>
                                View Profile
                              </DropdownMenuItem>
                              {user.role === "user" ? (
                                <DropdownMenuItem onClick={() => handleRoleChange(user._id, "admin")}>
                                  Make Admin
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleRoleChange(user._id, "user")}>
                                  Remove Admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                Deactivate Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
