// Express setup
import express from 'express';
const app = express();
app.use(express.json());

let posts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first post',
    comments: [
      { id: 1, text: 'Great post!' },
      { id: 2, text: 'Thanks for the info' },
      { id: 3, text: 'Very helpful' },
    ],
  },
];

// Route to get comments for a specific post
app.get('/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (post) {
    res.status(200).json(post.comments);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Route to add a comment to a specific post
app.post('/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (post) {
    const newComment = { id: post.comments.length + 1, text: req.body.text };
    post.comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
