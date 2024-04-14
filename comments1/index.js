const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsPostById = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsPostById[req.params.id] || []);
    console.log(commentsPostById);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsPostById[req.params.id] || [];
    comments.push({ id: commentId, content });
    commentsPostById[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    });

    res.send({status:"ok"});
});

app.post('/events', (req, res) => {
    console.log('Received an Event', req.body.type);
    res.send({ status: 'ok' });
});

app.listen(4001, () => console.log("Listening on 4001"));
