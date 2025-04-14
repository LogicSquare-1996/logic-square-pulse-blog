
import React from 'react';
import { motion } from "framer-motion";
import { Building, MapPin, AtSign, Phone, Clock, Check } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const About = () => {
  return (
    <div className="container mx-auto py-20 px-4">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Logic Square Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A platform to share knowledge, ideas, and technical insights within Logic Square
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our mission is to create a collaborative knowledge sharing platform where Logic Square employees can document, share, and learn from each other's experiences and insights.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This blog platform enables our team to build a rich knowledge base, foster innovation, and create a community of continuous learning and improvement.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blog-purple/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-blog-purple" />
                </div>
                <h3 className="text-xl font-semibold">Rich Content Creation</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced markdown editor with syntax highlighting, media embedding, and code snippets.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blog-purple/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-blog-purple" />
                </div>
                <h3 className="text-xl font-semibold">Collaboration</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Like, comment, and bookmark posts from colleagues to build on shared knowledge.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blog-purple/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-blog-purple" />
                </div>
                <h3 className="text-xl font-semibold">Categorization</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Organize content with tags, categories, and powerful search functionality.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blog-purple/20 flex items-center justify-center mr-3">
                  <Check className="h-5 w-5 text-blog-purple" />
                </div>
                <h3 className="text-xl font-semibold">Mobile Responsive</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Access the platform from any device with a seamless experience.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Contact Us</h2>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Building className="mr-3 text-blog-purple" />
                  <span className="text-gray-700 dark:text-gray-300">Logic Square Technologies</span>
                </div>
                <div className="flex items-center mb-4">
                  <MapPin className="mr-3 text-blog-purple" />
                  <span className="text-gray-700 dark:text-gray-300">123 Tech Park, Innovation Road</span>
                </div>
                <div className="flex items-center mb-4">
                  <AtSign className="mr-3 text-blog-purple" />
                  <span className="text-gray-700 dark:text-gray-300">contact@logic-square.com</span>
                </div>
                <div className="flex items-center mb-4">
                  <Phone className="mr-3 text-blog-purple" />
                  <span className="text-gray-700 dark:text-gray-300">+1 234 567 8900</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-3 text-blog-purple" />
                  <span className="text-gray-700 dark:text-gray-300">Mon-Fri: 9 AM - 6 PM</span>
                </div>
              </div>
              
              <div>
                <iframe 
                  title="Logic Square Location"
                  className="w-full h-[200px] rounded-lg border border-gray-200 dark:border-gray-700"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424146.1026392048!2d150.65177769804143!3d-33.8473567145046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sin!4v1650296246584!5m2!1sen!2sin"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            The Logic Square Blog platform is exclusively available for Logic Square employees. If you're part of our team, sign up using your @logic-square.com email address to start sharing your knowledge and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="bg-blog-purple hover:bg-blog-purple-dark text-white py-3 px-8 rounded-lg font-medium text-center">
              Create an Account
            </a>
            <a href="/login" className="bg-transparent border border-blog-purple text-blog-purple hover:bg-blog-purple/10 py-3 px-8 rounded-lg font-medium text-center">
              Sign In
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
