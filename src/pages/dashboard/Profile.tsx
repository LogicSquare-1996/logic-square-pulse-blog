
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import * as s3Api from "@/api/s3";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user) {
      setName(user.name);
      setBio(user.bio || "");
      setProfilePicture(user.profilePicture);
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Upload profile picture to S3 if changed
      let finalProfilePicture = profilePicture;
      if (profilePictureFile) {
        const uploadedUrl = await s3Api.uploadToS3(profilePictureFile);
        if (uploadedUrl) {
          finalProfilePicture = uploadedUrl;
        } else {
          toast.error("Failed to upload profile picture");
          setLoading(false);
          return;
        }
      }
      
      const success = await updateProfile({
        name,
        bio,
        profilePicture: finalProfilePicture
      });
      
      if (success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4 group">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800">
                  <AvatarImage src={profilePicture} alt={name} />
                  <AvatarFallback className="text-3xl">{name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-picture"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="text-white h-8 w-8" />
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the image to change your profile picture
              </p>
            </div>
            
            {/* Email (readonly) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (cannot be changed)</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>
            
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blog-purple hover:bg-blog-purple-dark text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
