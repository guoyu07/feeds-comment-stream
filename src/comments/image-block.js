import React from 'react';

export default ({user}) => (
  <figure className="media-left">
    <p className="image is-64x64">
      <img alt={user} src="http://bulma.io/images/placeholders/128x128.png" />
    </p>
  </figure>
);
