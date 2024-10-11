const express = require('express');
const app = express();
app.use(express.json());

// In-memory data storage using arrays
let posts = [
  {
    id: 1,
    title: "First Post",
    content: "This is the first post.",
    comments: [
      { id: 1, text: "Great post!" },
      { id: 2, text: "Thanks for sharing." },
      { id: 3, text: "Awesome!" }
    ]
  }
];
let nextPostId = 2;
let nextCommentId = 4;

// Routes for posts

// View all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Add a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: nextPostId++,
    title,
    content,
    comments: []
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Update an existing post
app.put('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.title = title;
  post.content = content;
  res.json(post);
});

// Delete a post (and its associated comments)
app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  posts.splice(postIndex, 1);
  res.status(204).end();
});

// Routes for comments

// View all comments for a specific post
app.get('/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post.comments);
});

// Add a comment to a specific post
app.post('/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const { text } = req.body;
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const newComment = {
    id: nextCommentId++,
    text
  };

  post.comments.push(newComment);
  res.status(201).json(newComment);
});

// Update a specific comment
app.put('/posts/:postId/comments/:commentId', (req, res) => {
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.commentId);
  const { text } = req.body;
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const comment = post.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  comment.text = text;
  res.json(comment);
});

// Delete a specific comment
app.delete('/posts/:postId/comments/:commentId', (req, res) => {
  const postId = parseInt(req.params.postId);
  const commentId = parseInt(req.params.commentId);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const commentIndex = post.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  post.comments.splice(commentIndex, 1);
  res.status(204).end();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
