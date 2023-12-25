/* eslint-disable react/no-unknown-property */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Badge, Icon, Truncate } from '@edx/paragon';
import { CheckCircle } from '@edx/paragon/icons';

import { PushPin } from '../../../components/icons';
import { AvatarOutlineAndLabelColors, Routes, ThreadType } from '../../../data/constants';
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
  // console.log('======', post)

  const showAnsweredBadge = post.hasEndorsed && post.type === ThreadType.QUESTION;
  const authorLabelColor = AvatarOutlineAndLabelColors[post.authorLabel];
  const canSeeReportedBadge = post.abuseFlagged || post.abuseFlaggedCount;
  const read = post.read || (!post.read && post.commentCount !== post.unreadCommentCount);
  
  const reportSelector = useSelector(state=>state.report)
  const { reasonCodesEnabled } = useSelector(selectModerationSettings);
  const dispatch = useDispatch();

  const [isDeleting, showDeleteConfirmation, hideDeleteConfirmation] = useToggle(false);

  const actionHandlers = {
    [ContentActions.EDIT_CONTENT]: () => history.push({
      ...location,
      pathname: `${location.pathname}/edit`,
    }),
    [ContentActions.DELETE]: showDeleteConfirmation,
    [ContentActions.CLOSE]: () => {
      if (post.closed) {
        dispatch(updateExistingThread(post.id, { closed: false }));
      } else if (reasonCodesEnabled) {
        showClosePostModal();
      } else {
        dispatch(updateExistingThread(post.id, { closed: true }));
      }
    },
    [ContentActions.COPY_LINK]: () => { navigator.clipboard.writeText(postURL.href); },
    [ContentActions.PIN]: () => dispatch(updateExistingThread(post.id, { pinned: !post.pinned })),
    [ContentActions.REPORT]: () => dispatch(updateExistingThread(post.id, { flagged: !post.abuseFlagged , report:reportSelector})),
  };
  

  return (
    <>
   <div className=' border-top'>

      <div className='row py-1'>

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
                    {/* <PostActionsBar /> */}
                    <ActionsDropdown commentOrPost={post} actionHandlers={actionHandlers}   />
                </div>
            </div>
            <div className='d-flex flex-column'>
                <span className='post-title'>{post.title}</span>
                <span>
                    <PostContent courseId={post.courseId} postId={post.id} previewBody={post.previewBody} renderedBody={post.renderedBody}/>
                    {/* <span>{previewBodyDecode}</span>
                    {previewBodyDecode.length == 145 && <span onClick={handlerBodyContent}> Xem them </span>} */}
                    
                    
                </span>
            </div>
        </div>

        <div>

        </div>
      </div>
   </div>
      {/* <Link
        className={
          classNames('discussion-post p-0 text-decoration-none text-gray-900', {
            'border-bottom border-light-400': showDivider,
          })
        }
        to={linkUrl}
        onClick={() => isSelected(post.id)}
        style={{ lineHeight: '22px' }}
        aria-current={isSelected(post.id) ? 'page' : undefined}
        role="option"
        tabIndex={(isSelected(post.id) || idx === 0) ? 0 : -1}
      >
        <div
          className={
            classNames('d-flex flex-row pt-2.5 pb-2 px-4 border-primary-500 position-relative',
              { 'bg-light-300': read })
          }
          style={post.id === postId ? {
            borderRightWidth: '4px',
            borderRightStyle: 'solid',
          } : null}
        >
          <PostAvatar post={post} authorLabel={post.authorLabel} fromPostLink read={read} />
          <div className="d-flex flex-column flex-fill" style={{ minWidth: 0 }}>
            <div className="d-flex flex-column justify-content-start mw-100 flex-fill">
              <div className="d-flex align-items-center pb-0 mb-0 flex-fill font-weight-500">
                <Truncate lines={1} className="mr-1.5" whiteSpace>
                  <span
                    class={
                        classNames('font-weight-500 font-size-14 text-primary-500 font-style-normal font-family-inter align-bottom',
                          { 'font-weight-bolder': !read })
                      }
                  >
                    {post.title}
                  </span>
                  <span class="align-bottom"> </span>
                  <span
                    class="text-gray-700 font-weight-normal font-size-14 font-style-normal font-family-inter align-bottom"
                  >
                    {isPostPreviewAvailable(post.previewBody)
                      ? previewBodyDecode
                      : intl.formatMessage(messages.postWithoutPreview)}
                  </span>
                </Truncate>
                {showAnsweredBadge && (
                  <Icon src={CheckCircle} className="text-success font-weight-500 ml-auto badge-padding" data-testid="check-icon">
                    <span className="sr-only">{' '}answered</span>
                  </Icon>
                )}

                {canSeeReportedBadge && (
                <Badge
                  variant="danger"
                  data-testid="reported-post"
                  className={`font-weight-500 badge-padding ${showAnsweredBadge ? 'ml-2' : 'ml-auto'}`}
                >
                  {intl.formatMessage(messages.contentReported)}
                  <span className="sr-only">{' '}reported</span>
                </Badge>
                )}

                {post.pinned && (
                <Icon
                  src={PushPin}
                  className={`icon-size ${canSeeReportedBadge || showAnsweredBadge ? 'ml-2' : 'ml-auto'}`}
                />
                )}
              </div>
            </div>
            <AuthorLabel
              author={post.author || intl.formatMessage(messages.anonymous)}
              authorLabel={post.authorLabel}
              labelColor={authorLabelColor && `text-${authorLabelColor}`}
            />
            <PostFooter post={post} preview intl={intl} showNewCountLabel={read} />
          </div>
        </div>
        {!showDivider && post.pinned && <div className="pt-1 bg-light-500 border-top border-light-700" />}
      </Link> */}
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
