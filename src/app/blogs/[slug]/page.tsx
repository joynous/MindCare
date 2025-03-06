import { notFound } from 'next/navigation';
import Image from 'next/image';

// Mock data for blog posts (replace with real data from an API or CMS)
const blogPosts = [
  {
    id: 1,
    slug: 'how-to-reduce-stress',
    title: 'How to Reduce Stress in Daily Life',
    content: `
      <p>Stress is a common part of life, but it doesn't have to control you. Here are some practical tips to reduce stress:</p>
      <ul>
        <li>Practice deep breathing exercises</li>
        <li>Take regular breaks during work</li>
        <li>Engage in physical activity</li>
        <li>Spend time with loved ones</li>
      </ul>
    `,
    date: '2023-10-15',
    image: '/images/blog1.jpg', // Replace with actual image path
  },
  {
    id: 2,
    slug: 'benefits-of-meditation',
    title: 'The Benefits of Meditation',
    content: `
      <p>Meditation has been proven to improve mental and physical health. Here are some benefits:</p>
      <ul>
        <li>Reduces anxiety and depression</li>
        <li>Improves focus and concentration</li>
        <li>Lowers blood pressure</li>
        <li>Enhances self-awareness</li>
      </ul>
    `,
    date: '2023-10-10',
    image: '/images/blog2.jpg', // Replace with actual image path
  },
  {
    id: 3,
    slug: 'digital-detox-tips',
    title: '5 Tips for a Successful Digital Detox',
    content: `
      <p>Taking a break from screens can help you reconnect with the real world. Here are 5 tips:</p>
      <ol>
        <li>Set specific times for checking emails and social media</li>
        <li>Turn off notifications</li>
        <li>Spend time outdoors</li>
        <li>Engage in offline hobbies</li>
        <li>Practice mindfulness</li>
      </ol>
    `,
    date: '2023-10-05',
    image: '/images/blog3.jpg', // Replace with actual image path
  },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound(); // Show 404 page if the post is not found
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="relative h-64 mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-6">{post.date}</p>
          <div
            className="prose prose-lg text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}