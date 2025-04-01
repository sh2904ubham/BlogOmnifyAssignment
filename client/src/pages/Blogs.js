import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get("http://localhost:5000/blogs");
      setBlogs(res.data);
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>All Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>By {blog.author.email}</p>
          <Link to={`/blog/${blog._id}`}>Read More</Link>
        </div>
      ))}
      <Link to="/create">Create Blog</Link>
    </div>
  );
};

export default Blogs;
