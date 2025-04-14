
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About LogicSquare Blog Portal</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            A platform for sharing knowledge and insights among LogicSquare team members
          </p>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 dark:text-gray-300">
                LogicSquare Blog Portal aims to create a collaborative environment where team members can share technical insights, industry trends, 
                project experiences, and knowledge across domains. This platform fosters a culture of continuous learning and knowledge exchange 
                among our talented professionals.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li>Secure authentication with LogicSquare email domain</li>
                <li>Rich Markdown editor for creating technical and non-technical blogs</li>
                <li>Support for code snippets with syntax highlighting</li>
                <li>Media uploads including images, videos, and document attachments</li>
                <li>Interactive comment system with nested replies</li>
                <li>Rating system to highlight valuable content</li>
                <li>Bookmarking and history tracking for easy reference</li>
                <li>Responsive design for all devices</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Guidelines for Authors</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                When creating content for the LogicSquare Blog Portal, please follow these guidelines:
              </p>
              
              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li>Focus on original content that provides value to readers</li>
                <li>Include practical examples when discussing technical concepts</li>
                <li>Credit sources and references appropriately</li>
                <li>Use appropriate tags to categorize your blog for better discoverability</li>
                <li>Proofread your content for clarity and correctness</li>
                <li>Be respectful and constructive when commenting on others' posts</li>
                <li>Keep confidential company information secure</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300">
                For any questions or support regarding the LogicSquare Blog Portal, please contact the admin team at:
              </p>
              
              <p className="mt-4 font-medium">
                <a href="mailto:blogadmin@logic-square.com" className="text-blog-purple hover:underline">
                  blogadmin@logic-square.com
                </a>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
              <p className="text-gray-700 dark:text-gray-300">
                The LogicSquare Blog Portal is built using modern web technologies:
              </p>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Frontend</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">React, TypeScript</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Styling</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tailwind CSS</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Backend</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Node.js, Express</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Database</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">MongoDB</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Storage</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AWS S3</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Authentication</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">JWT, OAuth</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Editor</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Markdown</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="font-semibold">Deployment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vercel, Render</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} LogicSquare Technologies</p>
        </div>
      </div>
    </div>
  );
};

export default About;
