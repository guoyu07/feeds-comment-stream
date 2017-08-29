const express = require('express');
const bodyParser = require('body-parser');

const Feeds = require('pusher-feeds-server');

const feeds = new Feeds({
  instanceId: 'v1:us1:7c9137f0-955d-447c-b317-2eba4597af2d',
  key: '71d4097e-6b85-4160-ae47-0b01853e4ab2:XdKRQc88QfIBpazVdOEpLuHm3x3BDbKbbs75qpa8ZbM='
});

const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Publis data into public feed
// Does not require any auth
app.post('/comments', (req, res) => {
  const comment = Object.assign(req.body, { created: Date.now() }); 
  // Seletect feedId
  const feedId = (comment.parentCommentId) ? `feed-${comment.parentCommentId}` : 'comments';

  feeds
    .publish(feedId, req.body)
    .then(data => res.sendStatus(204))
    .catch(err => res.status(400).send(err));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Listening on port ${port}`);
