import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Icon, IconButtonWithTooltip } from '@edx/paragon';

import { ThumbUpFilled, ThumbUpOutline } from '../../../components/icons';
import messages from './messages';
import likeIcon from './assets/like.svg'
import iconLiked from '../../../assets/Liked.svg'


function LikeButton({
  count,
  intl,
  onClick,
  voted,
  preview,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    return false;
  };

  return (
    <div className="d-flex align-items-end ">
     <span className='like-icon' onClick={handleClick}>
      <img  src={!voted? likeIcon : iconLiked} alt='like' />
     </span>
     <span className='tag-filter'> {count} </span>
    </div>
  );
}

LikeButton.propTypes = {
  count: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  onClick: PropTypes.func,
  voted: PropTypes.bool,
  preview: PropTypes.bool,
};

LikeButton.defaultProps = {
  voted: false,
  onClick: undefined,
  preview: false,
};

export default injectIntl(LikeButton);
