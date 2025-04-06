const imagePath = "/images";
import BlogCard from '../components/BlogCard';

// Mock data for blog posts (replace with real data from an API or CMS)
const blogPosts = [
  {
    id: 1,
    slug: 'how-to-reduce-stress',
    title: 'How to Reduce Stress in Daily Life',
    excerpt: 'Learn practical tips to manage stress and improve your mental well-being.',
    date: '2023-10-15',
    image: imagePath + '/stress.jpg', // Replace with actual image path
  },
  {
    id: 2,
    slug: 'benefits-of-meditation',
    title: 'The Benefits of Meditation',
    excerpt: 'Discover how meditation can improve your mental and physical health.',
    date: '2023-10-10',
    image: imagePath + '/meditation.jpg', // Replace with actual image path
  },
  {
    id: 3,
    slug: 'digital-detox-tips',
    title: '5 Tips for a Successful Digital Detox',
    excerpt: 'Take a break from screens and reconnect with the real world.',
    date: '2023-10-05',
    image: imagePath + '/digital detox.jpg', // Replace with actual image path
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}