const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Import the Express app

const { expect } = chai;
chai.use(chaiHttp);

describe('Blog API', () => {
  let testPostId;
  let testCommentId;

  // Test case to add a new post
  it('should add a new post', (done) => {
    chai.request(app)
      .post('/posts')
      .send({ title: 'Test Post', content: 'This is a test post' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('title', 'Test Post');
        expect(res.body).to.have.property('content', 'This is a test post');
        testPostId = res.body.id; // Save the post ID for further tests
        done();
      });
  });

  // Test case to update an existing post
  it('should update the post content and title', (done) => {
    chai.request(app)
      .put(`/posts/${testPostId}`)
      .send({ title: 'Updated Test Post', content: 'Updated content' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('title', 'Updated Test Post');
        expect(res.body).to.have.property('content', 'Updated content');
        done();
      });
  });

  // Test case to add a new comment to the post
  it('should add a comment to the post', (done) => {
    chai.request(app)
      .post(`/posts/${testPostId}/comments`)
      .send({ text: 'This is a test comment' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('text', 'This is a test comment');
        testCommentId = res.body.id; // Save the comment ID for further tests
        done();
      });
  });

  // Test case to update an existing comment
  it('should update the comment text', (done) => {
    chai.request(app)
      .put(`/posts/${testPostId}/comments/${testCommentId}`)
      .send({ text: 'Updated test comment' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('text', 'Updated test comment');
        done();
      });
  });

  // Test case to delete the comment
  it('should delete the comment', (done) => {
    chai.request(app)
      .delete(`/posts/${testPostId}/comments/${testCommentId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Comment deleted successfully');
        done();
      });
  });

  // Test case to delete the post
  it('should delete the post', (done) => {
    chai.request(app)
      .delete(`/posts/${testPostId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Post deleted successfully');
        done();
      });
  });
});
