/* eslint-disable react/no-unknown-property */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Badge, Icon, Truncate } from '@edx/paragon';
import { CheckCircle } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { PushPin } from '../../../components/icons';
import { ALL_ROUTES, AvatarOutlineAndLabelColors, Routes, ThreadType } from '../../../data/constants';
import AuthorLabel from '../../common/AuthorLabel';
import { DiscussionContext } from '../../common/context';
import { discussionsPath, isPostPreviewAvailable } from '../../utils';
import messages from './messages';
import PostFooter from './PostFooter';
import { PostAvatar } from './PostHeader';
import { postShape } from './proptypes';
import PostActionsBar from '../post-actions-bar/PostActionsBar';
import { ActionsDropdown } from '../../common';
import { ContentActions } from '../../../data/constants';
import { Hyperlink, useToggle } from '@edx/paragon';
import { useDispatch, useSelector } from 'react-redux';
import { removeThread , updateExistingThread } from '../data/thunks';
import { selectModerationSettings } from '../../data/selectors';
import iconComment from '../assets/comment.svg'
import iconLike from '../assets/like.svg'
import './post.scss'
import PostContent from './PostContent';
import iconPin from '../../../assets/pin.svg'
import iconUnion from '../../../assets/Union.svg'
import iconClose from '../../../assets/lock.svg'



function PostLink({
  post,
  isSelected,
  showDivider,
  idx,
}) {
  const intl = useIntl();
  const {
    page,
    postId,
    inContext,
    category,
    learnerUsername,
  } = useContext(DiscussionContext);
  const linkUrl = discussionsPath(Routes.COMMENTS.PAGES[page], {
    0: inContext ? 'in-context' : undefined,
    courseId: post.courseId,
    topicId: post.topicId,
    postId: post.id,
    category,
    learnerUsername,
  });

  const history = useHistory()
  const showAnsweredBadge = post.hasEndorsed && post.type === ThreadType.QUESTION;
  const authorLabelColor = AvatarOutlineAndLabelColors[post.authorLabel];
  const canSeeReportedBadge = post.abuseFlagged || post.abuseFlaggedCount;
  const read = post.read || (!post.read && post.commentCount !== post.unreadCommentCount);
  
  const reportSelector = useSelector(state=>state.report)
  const { reasonCodesEnabled } = useSelector(selectModerationSettings);
  const dispatch = useDispatch();

  const [isDeleting, showDeleteConfirmation, hideDeleteConfirmation] = useToggle(false);
  const {url} = useRouteMatch(ALL_ROUTES)
  const postURL = new URL(`${getConfig().PUBLIC_PATH}${post.courseId}/posts/${post.id}`, window.location.origin);

  const actionHandlers = {
    [ContentActions.EDIT_CONTENT]: () => history.push({
      pathname: `${url}/${post.id}/edit`,
    }),
    [ContentActions.DELETE]: ()=>dispatch(removeThread(post.id)),
    [ContentActions.CLOSE]: () => {
      if (post.closed) {
        dispatch(updateExistingThread(post.id, { closed: false }));
      } else if (reasonCodesEnabled) {
        showClosePostModal();
      } else {
        dispatch(updateExistingThread(post.id, { closed: true }));
      }
    },
    [ContentActions.COPY_LINK]: () => { navigator.clipboard.writeText(postURL); },
    [ContentActions.PIN]: () => dispatch(updateExistingThread(post.id, { pinned: !post.pinned })),
    [ContentActions.REPORT]: () => dispatch(updateExistingThread(post.id, { flagged: !post.abuseFlagged , report:reportSelector})),
  };


  return (
    <>
   <div className=' card d-flex flex-column justify-content-around px-3 position-relative' style={{height:'174px'}}>
      <div className='d-flex align-items-center justify-content-between'>
        <div >
          {post.hasEndorsed && <div className='tag-mark-answer '>
              <img src={iconUnion} alt='answer' width='16px' height='16px'/>
            </div>}
          <div className='d-flex' style={{gap:'8px', marginLeft:`${post.hasEndorsed ? '58px' : '0px'}`}}>
            {post.closed && <img src={iconClose} alt='close' />}
            {post.pinned && <img src={iconPin} alt='pin' width='16px' height='16px' />}
            <div><span className='tag-filter tag-total'>Tổng quan</span></div>
            {post.following && <div><span className='tag-filter tag-total'>Đang theo dõi</span></div>}
          </div>
        </div>
        <div className=''>
          <ActionsDropdown commentOrPost={post} actionHandlers={actionHandlers}   />
        </div>
      </div>
      <div className='d-flex flex-column '>
          <span className='post-title'>{post.title}</span>
          <PostContent courseId={post.courseId} postId={post.id} previewBody={post.previewBody} renderedBody={post.renderedBody}/>
      </div>
      <div className='d-flex  py-2' style={{gap:'8px'}}>
            <span className='d-flex' >
              <img src={iconLike}  />
              <span className='tag-filter'>{post.voteCount}</span>
            </span>

            <span className='d-flex' >
              <img src={iconComment}  />
              <span className='tag-filter'>{post.commentCount -1}</span>
            </span>
      </div>
      {/* <div className='row py-1'>

        <div className='col-2 d-flex flex-column'>
            <span className='d-flex' >
              <img src={iconLike}  />
              <span className='tag-filter'>{post.voteCount}</span>
            </span>

            <span className='d-flex' >
              <img src={iconComment}  />
              <span className='tag-filter'>{post.commentCount -1}</span>
            </span>
        </div>

        <div className='col'>
            <div className='d-flex justify-content-between'>
                <div className='d-flex ' style={{gap:'8px'}}>
                  {post.pinned &&  <div><span className='tag-filter tag-pin'><i class="bi bi-pin-angle"></i></span></div>}
                  {post.closed &&  <div><span className='tag-filter  tag-close'>Đã đóng</span></div> }

                  <div><span className='tag-filter tag-total'>Tổng quan</span></div>
                  {post.pinned && <div><span className='tag-filter tag-total'>Đang theo dõi</span></div>}
                </div>
                <div>
                    <ActionsDropdown commentOrPost={post} actionHandlers={actionHandlers}   />
                </div>
            </div>
            <div className='d-flex flex-column'>
                <span className='post-title'>{post.title}</span>
                <span>
                    <PostContent courseId={post.courseId} postId={post.id} previewBody={post.previewBody} renderedBody={post.renderedBody}/>
                    
                    
                </span>
            </div>
        </div>

        <div>

        </div>
      </div> */}
   </div>
    </>
  );
}

PostLink.propTypes = {
  post: postShape.isRequired,
  isSelected: PropTypes.func.isRequired,
  showDivider: PropTypes.bool,
  idx: PropTypes.number,
};

PostLink.defaultProps = {
  showDivider: true,
  idx: -1,
};

export default PostLink;
