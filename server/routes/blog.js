import express from "express";
import Blog from "../models/Blog.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/", authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = new Blog({ title, content, author: req.user.id });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const blogs = await Blog.find().populate("author", "email").limit(5);
  res.json(blogs);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "email");
  res.json(blog);
});

router.put("/:id", authenticate, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

  blog.title = req.body.title;
  blog.content = req.body.content;
  await blog.save();
  res.json(blog);
});

router.delete("/:id", authenticate, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.author.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

  await blog.remove();
  res.json({ message: "Blog deleted" });
});

export default router;
