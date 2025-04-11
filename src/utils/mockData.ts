
import { BlogPost } from "@/components/blog/BlogCard";

// Helper function to generate a random date within the last 30 days
const randomDate = () => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 30);
  now.setDate(now.getDate() - randomDays);
  return now.toISOString();
};

// Mock user data
const mockUsers = [
  {
    id: "user1",
    name: "Priya Sharma",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "user2",
    name: "Rahul Kapoor",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "user3",
    name: "Aisha Patel",
    avatarUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "user4",
    name: "Vikram Singh",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: "user5",
    name: "Neha Gupta",
    avatarUrl: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

// Mock featured blog data (for the slider)
export const mockFeaturedBlogs: BlogPost[] = [
  {
    id: "blog1",
    title: "Building Scalable Frontend Applications with React and TypeScript",
    excerpt: "Learn how to structure your React applications with TypeScript for maximum scalability and maintainability. This comprehensive guide covers best practices, design patterns, and performance optimization techniques.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[0],
    likes: 243,
    comments: 42,
    tags: ["React", "TypeScript", "Frontend"],
  },
  {
    id: "blog2",
    title: "Advanced Node.js Microservices Architecture",
    excerpt: "Dive deep into building robust microservices using Node.js, Express, and Docker. Learn how to design for fault tolerance, implement effective communication patterns, and deploy services at scale.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[1],
    likes: 187,
    comments: 36,
    tags: ["Node.js", "Microservices", "Docker"],
  },
  {
    id: "blog3",
    title: "AI-Driven Development: The Future of Software Engineering",
    excerpt: "Explore how artificial intelligence is revolutionizing software development workflows, from automated code generation to intelligent debugging and predictive analytics for project management.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[2],
    likes: 312,
    comments: 58,
    tags: ["AI", "Machine Learning", "Future Tech"],
  },
];

// Generate more mock blogs
export const mockBlogs: BlogPost[] = [
  ...mockFeaturedBlogs,
  {
    id: "blog4",
    title: "Modern CSS Techniques Every Developer Should Know",
    excerpt: "Discover powerful CSS features like Grid, Flexbox, Custom Properties, and more that make responsive design easier and more maintainable than ever before.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[3],
    likes: 156,
    comments: 27,
    tags: ["CSS", "Frontend", "Web Design"],
  },
  {
    id: "blog5",
    title: "DevOps Best Practices for Continuous Delivery",
    excerpt: "Learn how to implement effective DevOps workflows that enable rapid, reliable software delivery through automation, monitoring, and collaboration.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1664575198308-3959904fa6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[4],
    likes: 203,
    comments: 41,
    tags: ["DevOps", "CI/CD", "Automation"],
  },
  {
    id: "blog6",
    title: "GraphQL vs REST: Choosing the Right API Architecture",
    excerpt: "A detailed comparison of GraphQL and REST API architectures, with practical advice on when to use each approach based on project requirements.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[0],
    likes: 178,
    comments: 32,
    tags: ["API", "GraphQL", "REST"],
  },
  {
    id: "blog7",
    title: "Serverless Architecture: Benefits and Trade-offs",
    excerpt: "Explore the advantages and challenges of serverless computing, with real-world examples and strategies for effective implementation.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1734&q=80",
    createdAt: randomDate(),
    author: mockUsers[1],
    likes: 143,
    comments: 24,
    tags: ["Serverless", "Cloud Computing", "AWS"],
  },
  {
    id: "blog8",
    title: "Mobile App Performance Optimization Strategies",
    excerpt: "Learn techniques to make your mobile applications faster, more responsive, and battery-efficient across both iOS and Android platforms.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[2],
    likes: 168,
    comments: 29,
    tags: ["Mobile", "Performance", "Optimization"],
  },
  {
    id: "blog9",
    title: "Data Visualization Best Practices for Developers",
    excerpt: "Discover principles and techniques for creating effective, interactive data visualizations that communicate insights clearly and accurately.",
    content: "Full content of the blog...",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
    createdAt: randomDate(),
    author: mockUsers[3],
    likes: 132,
    comments: 22,
    tags: ["Data Visualization", "D3.js", "Frontend"],
  },
];

export const getCurrentUser = () => {
  return {
    id: "currentUser",
    name: "Anand Verma",
    email: "anand@logic-square.com",
    avatarUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    jobTitle: "Senior Software Engineer",
    bio: "Passionate about web development, cloud technologies, and open source software. Enjoys sharing knowledge through writing and mentoring.",
  };
};

export const mockTags = [
  "React", "Node.js", "TypeScript", "JavaScript", "GraphQL", "REST API", 
  "Frontend", "Backend", "DevOps", "AI", "Machine Learning", "Cloud Computing", 
  "AWS", "Docker", "Kubernetes", "Serverless", "CSS", "HTML", "Mobile", 
  "Performance", "Security", "Testing", "CI/CD", "Microservices"
];
