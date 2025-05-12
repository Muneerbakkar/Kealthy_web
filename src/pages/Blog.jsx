import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SEO from "../components/SEO";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

// Scroll to the top on mount
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

// Scroll to the top (smoothly) whenever page changes
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);

  // Fetch blogs from Firestore, ordered by date (newest first)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchBlogs();
  }, []);

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const nextPage = () => {
    if (indexOfLastBlog < blogs.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <SEO title="Kealthy Blog" description="This is a Blog Page" />
      <section className="bg-white text-black pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center">
            <span className="border-t-2 border-[#027d4f] w-8 mr-2"></span>
            KEALTHY BLOG
            <span className="border-t-2 border-[#027d4f] w-8 ml-2"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                  src={blog.imageUrls?.[0] || "/images/placeholder.png"}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
                <div className="p-4">
                  <p className="text-gray-500 text-sm">
                    {blog.createdAt?.toDate().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="text-lg font-semibold mt-2">{blog.title}</h3>
                  <p className="text-gray-700 mt-2 line-clamp-3">
                    {blog.content}
                  </p>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="mt-4 text-[#027d4f] font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-1 text-sm md:px-6 md:py-2 md:text-lg rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
            >
              <FaArrowLeft className="inline mr-1 md:mr-2" /> Previous
            </button>
            <button
              onClick={nextPage}
              disabled={indexOfLastBlog >= blogs.length}
              className={`px-4 py-1 text-sm md:px-6 md:py-2 md:text-lg rounded-md ${
                indexOfLastBlog >= blogs.length
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white"
              }`}
            >
              Next <FaArrowRight className="inline ml-1 md:ml-2" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
