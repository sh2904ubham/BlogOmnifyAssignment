import express from "express";
import Blog from "../models/Blog.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Blog (Protected Route)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newBlog = new Blog({
      title,
      content,
      author: req.user.id, // Extracted from token
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Blogs (Public Route with Pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Adjust as needed
    const skip = (page - 1) * limit;

    const blogs = await Blog.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Blog (Public Route)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Blog (Protected Route)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the user is the owner of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this blog" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    await blog.save();

    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Blog (Protected Route)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the user is the owner of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
