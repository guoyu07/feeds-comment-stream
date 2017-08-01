import React from 'react';

import ImageBlock from './image-block';

export default ({
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

    if (e.charCode === 13) {
      onCommentSubmit(e);
    }

    if (e.keyCode === 13) {
      onCommentSubmit(e);
    }
  };

  return (
    <article style={{marginBottom: 20}} className="media">
      <ImageBlock user={user} />
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
                </div> :
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
};
