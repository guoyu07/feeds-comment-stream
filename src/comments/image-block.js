import React from 'react';
import avatar from './avatar.svg';

export default ({user}) => (
  <figure className="media-left">
    <p className="image is-64x64">
      <img alt={user} src={avatar} />
    </p>
  </figure>
);
