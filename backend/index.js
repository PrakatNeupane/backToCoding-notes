import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

import jwt from "jsonwebtoken";
import { authenticateToken } from "./utlities.js";

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body || {};

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: "Please enter your email" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please enter your password" });
  }

  const userInfo = await User.findOne({ email, password });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600m",
    });
    return res.json({
      message: "Login Successful",
      error: false,
      accessToken,
      email,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid credentitals",
    });
  }
});

// Add note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, tags, content } = req.body || {};
  const { user } = req.user;
  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;
  if (!title && !content && !tags) {
    return res.status(400).json({ error: true, message: "No changes made" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    console.log("note: ", note);
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

// Get all the notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.status(400).json({
      error: false,
      notes,
      message: "Notes retrieved successfully for the given user. ",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Delete a note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const noteId = req.params.noteId;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });
    await Note.deleteOne({ _id: noteId, userId: user._id });
    res
      .status(400)
      .json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Update note isPinned value
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note)
      return res.status(404).json({ error: true, message: "Note not found" });

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});

export default app;
