import React from 'react';

import { timeSince } from '../utils';
import SubCommentItem from './sub-comment-item';
import LoadMoreButton from './load-more-button';
import ImageBlock from './image-block';

export default ({id, message, user, created, onReplyClick, onLoadMoreClick, children, replies}) => (
  <article className="media">
    <ImageBlock user={user} />
    <div className="media-content">
      <div className="content">
        <p>
          <strong>{user}</strong>
          <br />
          {message}
          <br />
          <small><a onClick={() => onReplyClick(id)}>Reply</a> · {timeSince(new Date(created))} ago</small>
        </p>
      </div>
      {
        // Check whether there are any remaining items
        replies && replies.items.length > 2 && replies.remaining ?
          <LoadMoreButton
            remaining={replies.remaining}
            onButtonClick={(e) => onLoadMoreClick(e, replies.items[0].id, id)}
          />
          : null
      }
      {replies ? replies.items.map(subComment => <SubCommentItem key={subComment.id} {...subComment} />) : null}
      {children}
    </div>
  </article>
);
