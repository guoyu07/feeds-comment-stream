import React, { Component } from 'react';

function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

const CommentTextarea = ({
  onCommentSubmit,
  onCancelClick,
  onTextareaChange,
  onSendByEnterChange,
  commentText,
  isNested,
  user,
  sendByEnter}) => {

  const onKeyPress = (e) => {
    if (!sendByEnter) {
      return;
    }

    if (e.charCode == 13) {
      onCommentSubmit(e);
    }

    if (e.keyCode == 13) {
      onCommentSubmit(e);
    }
  };

  return (
    <article style={{marginBottom: 20}} className="media">
      <figure className="media-left">
          <p className="image is-64x64">
          <img src="http://bulma.io/images/placeholders/128x128.png" />
          </p>
      </figure>
      <div className="media-content">
        <form onSubmit={onCommentSubmit}>
          <div className="field">
          <p className="control">
            <textarea
              value={commentText}
              onChange={onTextareaChange}
              onKeyPress={onKeyPress}
              className="textarea"
              placeholder={`Add a comment as ${user}`}
            />
          </p>
          </div>
          <nav className="level">
          <div className="level-left">
              <div className="level-item">
                  <label className="checkbox">
                      <input onChange={onSendByEnterChange} checked={sendByEnter} type="checkbox" /> Press enter to submit
                  </label>
              </div>
          </div>
          <div className="level-right">
              {isNested ?
                <div className="level-item">
                  <button onClick={onCancelClick} className="button is-danger">Reply to main thread</button>
                </div>
                :
                null
              }
              <div className="level-item">
                  <button type="submit" className="button is-info">Submit</button>
              </div>
          </div>
          </nav>
        </form>
      </div>
    </article>
  );
}

const SubComment = ({id, message, user, timestamp}) => (
  <article key={id} className="media">
    <figure className="media-left">
      <p className="image is-48x48">
        <img alt={message} src="http://bulma.io/images/placeholders/96x96.png" />
      </p>
    </figure>
    <div className="media-content">
      <div className="content">
        <p>
          <strong>{user}</strong>
          <br />
          {message}
          <br />
          <small>{timeSince(new Date(timestamp))} ago</small>
      </p>
      </div>
    </div>
  </article>
);

const Comment = ({id, message, user, timestamp, onReplyClick, onLoadMoreClick, children, subComments}) => {
  return (
    <article className="media">
      <figure className="media-left">
        <p className="image is-48x48">
          <img alt={message} src="http://bulma.io/images/placeholders/96x96.png" />
        </p>
      </figure>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{user}</strong>
            <br />
            {message}
            <br />
            <small><a onClick={() => onReplyClick(id)}>Reply</a> · {timeSince(new Date(timestamp))} ago</small>
          </p>
        </div>
        {subComments.length > 4 ? 
          <article className="media has-text-centered">
            <button
              onClick={(e) => onLoadMoreClick(e, subComments[subComments.length - 1].id, id)}
              style={{ display: 'block', margin: '0 auto' }}
              className="button is-info is-small">
              Load more
            </button>
          </article>
          : null
        }
        {subComments.map(subComment => <SubComment key={subComment.id} {...subComment} />)}
        {children}
      </div>
    </article>
  )
}

class Comments extends Component {
  
  state = {
    commentText: '',
    renderTextareaTo: '',
    sendByEnter: false
  };

  componentDidMount () {
    setInterval(() => this.forceUpdate(), 10000);
  }

  onTextareaChange = e => {
    this.setState({ commentText: e.target.value });
  };

  onReplyClick = (id) => {
    this.setState({ renderTextareaTo: id });
  };

  onLoadMoreClick = (e, commentId, parentCommentId) => {
    e.preventDefault();
    this.props.onLoadMoreClick(commentId, parentCommentId);
  };

  onCancelClick = (e) => {
    e.preventDefault();
    this.setState({ renderTextareaTo: '' });
  };

  onCommentSubmit = (e, parentCommentId) => {
    e.preventDefault();

    if (!this.state.commentText) {
      return;
    }

    this.props.onCommentSubmit(this.state.commentText, parentCommentId);
    this.setState({ commentText: '' });
  };

  onSendByEnterChange = () => {
    this.setState({ sendByEnter: !this.state.sendByEnter })
  };

  render() {
    return (
      <div>
        {!this.state.renderTextareaTo ?
            <CommentTextarea
              onCommentSubmit={(e) => this.onCommentSubmit(e, false)}
              onCancelClick={this.onCancelClick}
              onTextareaChange={this.onTextareaChange}
              commentText={this.state.commentText}
              user={this.props.user}
              sendByEnter={this.state.sendByEnter}
              onSendByEnterChange={this.onSendByEnterChange}
              onKeyPress={this.onKeyPress}
              isNested={false}
            />
            : null
          }
          {this.props.items.map((item, i) => (
            <Comment
              onReplyClick={this.onReplyClick}
              onLoadMoreClick={this.onLoadMoreClick}
              key={item.id}
              subComments={this.props.subItems
                .filter(subComment => subComment.parentCommentId === item.id)
              }
              {...item}
            >
              {this.state.renderTextareaTo === item.id ?
                <CommentTextarea
                  onCommentSubmit={(e) => this.onCommentSubmit(e, item.id)}
                  onCancelClick={this.onCancelClick}
                  onTextareaChange={this.onTextareaChange}
                  commentText={this.state.commentText}
                  user={this.props.user}
                  sendByEnter={this.state.sendByEnter}
                  onSendByEnterChange={this.onSendByEnterChange}
                  onKeyPress={this.onKeyPress}
                  isNested={true}
                />
                : null
              }
            </Comment>
          ))}
          {this.props.items.length > 4 ? 
            <article className="media has-text-centered">
              <button
              onClick={(e) => this.onLoadMoreClick(e, this.props.items[this.props.items.length-1].id, false)}
              style={{ display: 'block', margin: '0 auto' }} className="button is-info is-small">Load more</button>
            </article>
            : null
          }
      </div>
    );
  }
}

export default Comments;
