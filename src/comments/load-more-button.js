import React from 'react';

export default ({onButtonClick}) => (
  <article className="media has-text-centered">
    <button
      onClick={onButtonClick}
      className="button is-info is-small"
      style={{ display: 'block', margin: '0 auto' }}>
      Load more
    </button>
  </article>
);
