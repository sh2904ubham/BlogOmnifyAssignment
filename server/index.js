import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blog.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch((err) => console.log(err));
