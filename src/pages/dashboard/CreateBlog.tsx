
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MDEditor from '@uiw/react-md-editor';
import { toast } from "sonner";
import { Image, X, FileText, HelpCircle } from "lucide-react";
import * as blogApi from "@/api/blog";
import * as s3Api from "@/api/s3";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };
  
  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachmentFiles(prev => [...prev, ...filesArray]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a blog");
      navigate("/login");
      return;
    }
    
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload thumbnail to S3
      let finalThumbnailUrl = thumbnailUrl;
      if (thumbnailFile) {
        const uploadedUrl = await s3Api.uploadToS3(thumbnailFile);
        if (!uploadedUrl) {
          toast.error("Failed to upload thumbnail");
          setLoading(false);
          return;
        }
        finalThumbnailUrl = uploadedUrl;
      }
      
      // Upload attachments to S3
      const uploadedAttachments = [];
      for (const file of attachmentFiles) {
        const uploadedUrl = await s3Api.uploadToS3(file);
        if (uploadedUrl) {
          uploadedAttachments.push(uploadedUrl);
        }
      }
      
      // Extract excerpt from content (first 150 chars)
      const excerpt = content
        .replace(/[#*`]/g, '') // Remove markdown characters
        .slice(0, 150) + (content.length > 150 ? '...' : '');
      
      // Create blog post
      const blogData = {
        title,
        content,
        excerpt,
        thumbnailUrl: finalThumbnailUrl,
        tags,
        attachments: uploadedAttachments
      };
      
      const blog = await blogApi.createBlog(blogData);
      
      if (blog) {
        toast.success("Blog created successfully");
        navigate(`/blog/${blog._id}`);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Create New Blog</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <HelpCircle size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Markdown Reference</DialogTitle>
                <DialogDescription>
                  Use markdown to format your blog content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm"># Heading 1</code>
                  </div>
                  <div className="p-2">
                    <h1 className="text-xl font-bold">Heading 1</h1>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">## Heading 2</code>
                  </div>
                  <div className="p-2">
                    <h2 className="text-lg font-bold">Heading 2</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">**Bold text**</code>
                  </div>
                  <div className="p-2">
                    <strong>Bold text</strong>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">*Italic text*</code>
                  </div>
                  <div className="p-2">
                    <em>Italic text</em>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">[Link text](https://example.com)</code>
                  </div>
                  <div className="p-2">
                    <a href="#" className="text-blog-purple">Link text</a>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">![Alt text](image-url.jpg)</code>
                  </div>
                  <div className="p-2">
                    <div className="text-sm">Image with alt text</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">- List item 1<br />- List item 2</code>
                  </div>
                  <div className="p-2">
                    <ul className="list-disc list-inside">
                      <li>List item 1</li>
                      <li>List item 2</li>
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">1. Item 1<br />2. Item 2</code>
                  </div>
                  <div className="p-2">
                    <ol className="list-decimal list-inside">
                      <li>Item 1</li>
                      <li>Item 2</li>
                    </ol>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">```js<br />const x = 'code block';<br />```</code>
                  </div>
                  <div className="p-2">
                    <div className="bg-gray-800 text-gray-100 p-2 rounded font-mono text-sm">
                      const x = &apos;code block&apos;;
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">&gt; Blockquote text</code>
                  </div>
                  <div className="p-2">
                    <blockquote className="pl-4 border-l-4 border-gray-300 italic">
                      Blockquote text
                    </blockquote>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    <code className="text-sm">---</code>
                  </div>
                  <div className="p-2">
                    <hr />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Image *</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
              {thumbnailUrl ? (
                <div className="relative">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    className="max-h-64 mx-auto object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => {
                      setThumbnailUrl("");
                      setThumbnailFile(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="flex flex-col items-center">
                    <Image className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      PNG, JPG or GIF (max. 2MB)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById("thumbnail")?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                  <input
                    id="thumbnail"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blog-purple/20 text-blog-purple px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blog-purple hover:text-blog-purple-dark"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <FileText className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload additional files for your blog
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PDF, DOCX, or images (max. 5MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById("attachments")?.click()}
                >
                  Select Files
                </Button>
              </div>
              <input
                id="attachments"
                type="file"
                className="hidden"
                multiple
                onChange={handleAttachmentChange}
              />
            </div>
            
            {attachmentFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachmentFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} />
                      <span className="text-sm truncate max-w-[300px]">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => removeAttachment(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <div data-color-mode="light" className="border rounded-lg">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || "")}
                preview="edit"
                height={500}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blog-purple hover:bg-blog-purple-dark text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Publish Blog"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateBlog;
