const express = require('express')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')

const app = express();
app.use(bodyParser.json())

const commentsPostById = {}

app.get('/posts/:id/comments' ,(req, res)=>{

    res.send(commentsPostById[req.params.id]||[])
    console.log(commentsPostById);
    
} )


app.post('/posts/:id/comments' ,(req, res)=>{

    const commentId = randomBytes(4).toString('hex');
    const {content}= req.body;

    const comments = commentsPostById[req.params.id] || []
    comments.push({id:commentId, content})

    commentsPostById[req.params.id] = comments;
    res.status(201).send(comments);

} )

app.listen(4001,()=> console.log("listening on 4001"))