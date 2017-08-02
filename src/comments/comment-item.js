import React from 'react';

import { timeSince } from '../utils';
import SubCommentItem from './sub-comment-item';
import LoadMoreButton from './load-more-button';
import ImageBlock from './image-block';

export default ({id, message, user, created, onReplyClick, onLoadMoreClick, subComments, children}) => (
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
        // Check whether last item first item in array has any more items to load
        subComments.length > 2 && subComments[0].hasNextItem !== false ?
          <LoadMoreButton onButtonClick={(e) => onLoadMoreClick(e, subComments[0].id, id)} />
          : null
      }
      {subComments.map(subComment => <SubCommentItem key={subComment.id} {...subComment} />)}
      {children}
    </div>
  </article>
);
