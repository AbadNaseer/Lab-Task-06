const express = require('express');
const app = express();
app.use(express.json());

// In-memory data structure
let posts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post.',
    comments: [
      { id: 1, text: 'First comment' },
      { id: 2, text: 'Second comment' },
      { id: 3, text: 'Third comment' }
    ]
  }
];
let postIdCounter = 2;
let commentIdCounter = 4;

// Routes for managing posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: postIdCounter++,
    title,
    content,
    comments: []
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  post.title = title;
  post.content = content;
  res.json(post);
});

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(p => p.id === parseInt(id));

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found' });
  }

  posts.splice(postIndex, 1);
  res.status(204).send();
});

// Routes for managing comments
app.get('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post.comments);
});

app.post('/posts/:postId/comments', (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const newComment = {
    id: commentIdCounter++,
    text
  };
  post.comments.push(newComment);
  res.status(201).json(newComment);
});

app.put('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  const { text } = req.body;
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = post.comments.find(c => c.id === parseInt(commentId));

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  comment.text = text;
  res.json(comment);
});

app.delete('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const commentIndex = post.comments.findIndex(c => c.id === parseInt(commentId));

  if (commentIndex === -1) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  post.comments.splice(commentIndex, 1);
  res.status(204).send();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
