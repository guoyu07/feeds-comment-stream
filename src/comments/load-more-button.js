import React from 'react';

export default ({onButtonClick, remaining}) => (
  <article className="media has-text-centered">
    <button
      onClick={onButtonClick}
      className="button is-info is-small"
      style={{ display: 'block', margin: '0 auto' }}>
      Load {remaining < 10 ? remaining : 10} more comments
    </button>
  </article>
);
