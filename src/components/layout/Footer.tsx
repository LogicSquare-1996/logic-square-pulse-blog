
import { Link } from "react-router-dom";
import { 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-blog-purple dark:text-blog-purple-light">
              Logic<span className="text-gray-600 dark:text-gray-300">Square</span>
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              A community blog platform for Logic Square employees to share knowledge, insights, and experiences.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-blog-purple dark:hover:text-blog-purple-light">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blog-purple dark:hover:text-blog-purple-light">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blog-purple dark:hover:text-blog-purple-light">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blog-purple dark:hover:text-blog-purple-light">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blog-purple dark:hover:text-blog-purple-light">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:px-4">
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blog-purple dark:hover:text-blog-purple-light">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-600 dark:text-gray-400 hover:text-blog-purple dark:hover:text-blog-purple-light">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blog-purple dark:hover:text-blog-purple-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blog-purple dark:hover:text-blog-purple-light">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blog-purple dark:hover:text-blog-purple-light">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="mr-3 text-gray-500 flex-shrink-0" size={18} />
                <a href="mailto:contact@logic-square.com" className="text-gray-600 dark:text-gray-400 hover:text-blog-purple dark:hover:text-blog-purple-light">
                  contact@logic-square.com
                </a>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Subscribe to our newsletter to get the latest updates.
                </p>
                <div className="mt-4 flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blog-purple flex-grow"
                  />
                  <button className="bg-blog-purple hover:bg-blog-purple-dark text-white font-medium py-2 px-4 rounded-r">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>© {currentYear} Logic Square Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
