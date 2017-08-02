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
  instanceId: YOUR_PUSHER_INSTANCE_ID,
});

class App extends Component {

  commentsFeeds = {};
  subCommentsFeeds = {};

  state = {
    comments: [],
    subComments: [],
    user: null
  };

  componentWillMount () {
    this.setState({user: localStorage.getItem('username')});

    this.commentsFeeds = feeds.feed("comments");
    this.commentsFeeds.subscribe({
      previousItems: 5,
      onItem: event => {
        const comment = Object.assign(event.body.data, {id: event.eventId});

        this.setState({comments: [comment, ...this.state.comments]});

        // Create new feed for every new comment
        const newFeedId = `feed-${comment.id}`;
        this.subCommentsFeeds[newFeedId] = feeds.feed(newFeedId);

        // Subscribe to new feed for subcomments
        this.subCommentsFeeds[newFeedId].subscribe({
          previousItems: 3,
          onItem: event => {
            const comment = Object.assign(event.body.data, {id: event.eventId});

            this.setState({subComments: [...this.state.subComments, comment]});
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
    const feed = (parentCommentId) ? this.subCommentsFeeds[`feed-${parentCommentId}`] : this.commentsFeeds;

    feed
      .getHistory({ fromId: commentId, limit: 10 })
      .then((data) => {
        const { items } = data;

        const formatedItems = items
          // Remove last requested item
          .filter(item => item.id !== commentId)
          .map(item => Object.assign(item.data, { id: item.id }));
        
        // If there is no history item
        if (formatedItems.length < 1) {
          // Remove loadMore button for this subComments feed
          if (this.state.subComments.length > 0) {
            const newSubcomments = this.state.subComments.slice();
            newSubcomments[0].hasNextItem = false;

            this.setState({subComments: newSubcomments});
          }
          return;
        }

        formatedItems[formatedItems.length - 1].hasNextItem = typeof data.next_id === 'string'; 

        if (parentCommentId) {
          formatedItems.sort(item => item.created);
          this.setState({subComments: [...formatedItems, ...this.state.subComments]});
        } else {
          this.setState({comments: [...this.state.comments, ...formatedItems]});
        }
      });
  };

  render() {
    const { user, comments, subComments } = this.state;

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
              subComments={subComments}
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
