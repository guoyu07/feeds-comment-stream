const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const Feeds = require('pusher-feeds-server');

const feeds = new Feeds({
  instanceId: 'v1:us1:e90dd65c-aff7-47a0-ac66-ebef656e3cdc',
  key: '4fabe6cc-3674-4378-a281-cfee86bf9fce:JPBFKpj/ffWx9Lih3ywD90IzRbnorF/WRKAX6Y2klC4='
});

const app = express();

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
  // Extends item by another parameters
  const comment = Object.assign(req.body, { id: uuidv4(), timestamp: Date.now() });
  const feedId = (comment.parentCommentId) ? `feed-${comment.parentCommentId}` : 'comments';

  feeds
    .publish(feedId, comment)
    .then(data => res.sendStatus(204))
    .catch(err => res.status(400).send(err));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Listening on port ${port}`);
