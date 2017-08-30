import React, { Component } from 'react';
import 'bulma/css/bulma.css'

import Header from './header';
import Footer from './footer';
import CommentsBlock from './comments';
import LoginForm from './login-form.js';

import Feeds from 'pusher-feeds-client';

// Api is running on different port in development
const API_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:5000' : '';

const feeds = new Feeds({
  instanceId: '',
});

class App extends Component {

  commentsFeed = {};
  repliesFeeds = {};

  state = {
    comments: {
      items: [],
      remaining: null,
      nextCursor: null
    },
    replies: {},
    user: null
  };

  componentWillMount () {
    this.setState({user: localStorage.getItem('username')});

    this.commentsFeed = feeds.feed("comments");
    this.commentsFeed.subscribe({
      previousItems: 5,
      onOpen: ({ remaining, next_cursor }) => {
        this.setState({
          comments: {
            ...this.state.comments,
            remaining,
            nextCursor: next_cursor,
          }
        });
      },
      onItem: item => {
        const comment = {...item.data, id: item.id};
        const newComments = {
          ...this.state.comments,
          items: [comment, ...this.state.comments.items]
        };

        this.setState({ comments: newComments });

        // Create new feed for every new comment
        const newFeedId = `feed-${comment.id}`;
        this.repliesFeeds[newFeedId] = feeds.feed(newFeedId);

        // Subscribe to new feed for replies
        this.repliesFeeds[newFeedId].subscribe({
          previousItems: 3,
          onOpen: ({ remaining, next_cursor }) => {
            this.setState({
              replies: {
                ...this.state.replies,
                [comment.id]: {
                  items: [],
                  remaining,
                  nextCursor: next_cursor
                }
              }
            });
          },
          onItem: item => {
            const reply = {...item.data, id: item.id};

            // If replies already exists
            if (this.state.replies[comment.id]) {
              this.setState({
                replies: {
                  ...this.state.replies,
                  [comment.id]: {
                    ...this.state.replies[comment.id],
                    items: [...this.state.replies[comment.id].items, reply]
                  }
                }
              });
              return;
            }

            this.setState({
              replies: {
                [comment.id]: {
                  items: [reply],
                  remaining: null,
                  nextCursor: null
                },
                ...this.state.replies
              }
            });
          }
        });
      },
      onError: error => {
        this.setState({ error });
      }
    });
  }

  getError () {
    if (!this.state.error) {
      return false;
    }

    return (
      <div className="notification is-danger">
        {this.state.error}
      </div>
    );
  }

  onLoginFormSubmit = (userName) => {
    localStorage.setItem('username', userName);
    this.setState({user: userName});
  };

  onCommentSubmit = (comment, parentCommentId) => {
    fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({parentCommentId: parentCommentId, message: comment, user: this.state.user})
    });
  };

  onLoadMoreClick = (commentId, parentCommentId) => {
    const feed = (parentCommentId) ? this.repliesFeeds[`feed-${parentCommentId}`] : this.commentsFeed;

    feed
      .paginate({ cursor: commentId, limit: 11 })
      .then((data) => {
        const { items, remaining, next_cursor } = data;

        const formatedItems = items
          // Remove last requested item
          .filter(item => item.id !== commentId)
          .map(item => Object.assign(item.data, { id: item.id }));

        if (parentCommentId) {
          formatedItems.sort(item => item.created);
          this.setState({
            replies: {
              [parentCommentId]: {
                items: [...formatedItems, ...this.state.replies[parentCommentId].items],
                remaining: remaining,
                nextCursor: next_cursor
              }
            }
          });
        } else {
          this.setState({
            comments: {
              items: [...this.state.comments.items, ...formatedItems],
              remaining: remaining,
              nextCursor: next_cursor
            }
          });
        }
      });
  };

  render() {
    const { user, comments, replies } = this.state;
    return (
      <div className="container">
        <Header />
        
        {this.getError()}

        <div className="content">
          {!user ?
            <LoginForm
              onFormSubmit={this.onLoginFormSubmit}
            /> :
            <CommentsBlock
              user={user}
              comments={comments}
              replies={replies}
              onCommentSubmit={this.onCommentSubmit}
              onLoadMoreClick={this.onLoadMoreClick}
            />
          }
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
