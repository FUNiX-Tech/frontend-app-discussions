import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import * as timeago from 'timeago.js';

import { injectIntl } from '@edx/frontend-platform/i18n';

import timeLocale from '../../common/time-locale';
import LikeButton from '../../posts/post/LikeButton';
import { editComment } from '../data/thunks';
import iconClock from '../../posts/post/assets/ph_clock-bold.svg'

function CommentIcons({
  comment,
}) {
  const dispatch = useDispatch();
  timeago.register('time-locale', timeLocale);

  const handleLike = () => dispatch(editComment(comment.id, { voted: !comment.voted }));
  return (
    <div className="d-flex flex-row align-items-center">
      <LikeButton
        count={comment.voteCount}
        onClick={handleLike}
        voted={comment.voted}
      />
      <div className="d-flex flex-fill text-gray-500 justify-content-end time-post" title={comment.createdAt}>
        <span title={comment.createdAt} className="">
          <img src={iconClock} alt='clock' />
           <span> {timeago.format(comment.createdAt, 'time-locale')}</span>
        </span>
      </div>
    </div>
  );
}

CommentIcons.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    voteCount: PropTypes.number,
    following: PropTypes.bool,
    voted: PropTypes.bool,
    createdAt: PropTypes.string,
  }).isRequired,
};

export default injectIntl(CommentIcons);
