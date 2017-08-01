import React from 'react';

import { timeSince } from '../utils';
import ImageBlock from './image-block';

export default ({id, message, user, created}) => (
  <article key={id} className="media">
    <ImageBlock />
    <div className="media-content">
      <div className="content">
        <p>
          <strong>{user}</strong>
          <br />
          {message}
          <br />
          <small>{timeSince(new Date(created))} ago</small>
      </p>
      </div>
    </div>
  </article>
);
