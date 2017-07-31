import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import './App.css';

import Comments from './Comments.js';
import LoginForm from './LoginForm.js';

import Feeds from 'pusher-feeds-client';

const feeds = new Feeds({
  instanceId: "v1:us1:e90dd65c-aff7-47a0-ac66-ebef656e3cdc",
});

class App extends Component {

  subCommentsFeeds = {};

  state = {
    comments: [],
    subComments: [],
    user: null
  };

  componentDidMount () {
    this.setState({user: localStorage.getItem('username')});

    this.commentsFeeds = feeds.feed("comments");
    this.commentsFeeds.subscribe({
      previousItems: 5,
      onItem: event => {
        const comment = event.body.data;

        this.setState({comments: [comment, ...this.state.comments]});

        // Create new feed for every comment item
        const newFeedId = `feed-${comment.id}`;

        this.subCommentsFeeds[newFeedId] = feeds.feed(newFeedId);
        this.subCommentsFeeds[newFeedId].subscribe({
          previousItems: 5,
          onItem: event => {
            const comment = event.body.data;

            this.setState({ subComments: [...this.state.subComments, comment] });
          }
        });
      },
      onError: error => {
        console.log('onError': error);
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

  onFormSubmit = (userName) => {
    localStorage.setItem('username', userName);
    this.setState({user: userName});
  }

  onCommentSubmit = (comment, parentCommentId) => {
    fetch('http://localhost:5000/comments', {
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
      .then(({ items }) => {
        console.log(items);
      });
  };

  render() {
    return (
      <div className="container">
        <section style={{marginBottom: 20}} className="hero is-info">
          <div className="hero-body">
            <div className="container">
              <img style={{width: 150}} alt="Feeds comment stream" src="https://d1mm8o1ylufpl8.cloudfront.net/images/pusher-logo-light.svg" />
              <h1 className="subtitle">
                Feeds Comment Stream Demo
              </h1>
            </div>
          </div>
        </section>

        <div className="content">
        {!this.state.user ?
          <LoginForm
            onFormSubmit={this.onFormSubmit}
          /> :
          <Comments
            onCommentSubmit={this.onCommentSubmit}
            user={this.state.user}
            items={this.state.comments}
            subItems={this.state.subComments}
            onLikeCommentClick={this.onLikeCommentClick}
            onLoadMoreClick={this.onLoadMoreClick}
          />
        }
        </div>

        <footer style={{marginTop: 20, padding: 10}} className="footer">
          <div className="container">
            <div className="content has-text-centered">
              <p>
                <strong>Feeds</strong> by <a target="_blank" href="http://pusher.com/feeds">Pusher</a>.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
