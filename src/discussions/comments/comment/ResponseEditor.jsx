import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import { DiscussionContext } from '../../common/context';
import { selectBlackoutDate } from '../../data/selectors';
import { inBlackoutDateRange } from '../../utils';
import messages from '../messages';
import CommentEditor from './CommentEditor';

function ResponseEditor({
  postId,
  intl,
  addWrappingDiv,
  showReponse,
  handlerHideReponse
  
}) {
  const { inContext } = useContext(DiscussionContext);
  const [addingResponse, setAddingResponse] = useState(false);

  useEffect(() => {
    setAddingResponse(false);
  }, [postId]);

  const blackoutDateRange = useSelector(selectBlackoutDate);

  return showReponse
    ? (
      <div className='pt-3'>
        <CommentEditor
          comment={{ threadId: postId }}
          edit={false}
          onCloseEditor={() => handlerHideReponse()}
        />
      </div>
    )
    : !inBlackoutDateRange(blackoutDateRange) && (
      <div className=''>
      </div>
    );
}

ResponseEditor.propTypes = {
  postId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  addWrappingDiv: PropTypes.bool,
};

ResponseEditor.defaultProps = {
  addWrappingDiv: false,
};

export default injectIntl(ResponseEditor);
