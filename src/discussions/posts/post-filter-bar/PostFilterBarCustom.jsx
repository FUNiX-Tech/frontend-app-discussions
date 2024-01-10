
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import iconFilter from '../assets/Filter.svg'
import './post-filter.scss'
import React, {
    useContext, useEffect, useMemo, useState,
  } from 'react';
import PropTypes from 'prop-types';
  
import classNames from 'classnames';
import { capitalize, isEmpty, toString } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';  
import {
    Collapsible, Form, Icon, Spinner, ModalPopup, useToggle
  } from '@edx/paragon';
import { Check, Tune } from '@edx/paragon/icons';
import {
    PostsStatusFilter, RequestStatus,
    ThreadOrdering, ThreadType,
  } from '../../../data/constants';
import { selectCourseCohorts } from '../../cohorts/data/selectors';
import { fetchCourseCohorts } from '../../cohorts/data/thunks';
import { DiscussionContext } from '../../common/context';
import { selectUserHasModerationPrivileges, selectUserIsGroupTa } from '../../data/selectors';
import {
    setCohortFilter, setPostsTypeFilter, setSortedBy, setStatusFilter,
  } from '../data';
import { selectThreadFilters, selectThreadSorting } from '../data/selectors';
import messages from './messages';
import { ActionItem } from './PostFilterBar';


const PostFilterBarCustom = ({intl, target})=>{
    const [showBox ,setShowBox] = useState(false)
    const [isOpen, open, close] = useToggle(false);

    const dispatch = useDispatch();
    const { courseId } = useParams();
    const { page } = useContext(DiscussionContext);
    const userHasModerationPrivileges = useSelector(selectUserHasModerationPrivileges);
    const userIsGroupTa = useSelector(selectUserIsGroupTa);
    const currentSorting = useSelector(selectThreadSorting());
    const currentFilters = useSelector(selectThreadFilters());
    const { status } = useSelector(state => state.cohorts);
    const cohorts = useSelector(selectCourseCohorts);
  
    const selectedCohort = useMemo(() => cohorts.find(cohort => (
      toString(cohort.id) === currentFilters.cohort)),
    [currentFilters.cohort]);
  
    const handleSortFilterChange = (event) => {
      const currentType = currentFilters.postType;
      const currentStatus = currentFilters.status;
      const {
        name,
        value,
      } = event.currentTarget;
      if (name === 'type') {
        dispatch(setPostsTypeFilter(value));
        if (
          value === ThreadType.DISCUSSION && currentStatus === PostsStatusFilter.UNANSWERED
        ) {
          // You can't filter discussions by unanswered
          dispatch(setStatusFilter(PostsStatusFilter.ALL));
        }
      }
      if (name === 'status') {
        dispatch(setStatusFilter(value));
        if (value === PostsStatusFilter.UNANSWERED && currentType !== ThreadType.QUESTION) {
          // You can't filter discussions by unanswered so switch type to questions
          dispatch(setPostsTypeFilter(ThreadType.QUESTION));
        }
        if (value === PostsStatusFilter.UNRESPONDED && currentType !== ThreadType.DISCUSSION) {
          // You can't filter questions by not responded so switch type to discussion
          dispatch(setPostsTypeFilter(ThreadType.DISCUSSION));
        }
      }
      if (name === 'sort') {
        dispatch(setSortedBy(value));
      }
      if (name === 'cohort') {
        dispatch(setCohortFilter(value));
      }
    };
  
    useEffect(() => {
      if (userHasModerationPrivileges && isEmpty(cohorts)) {
        dispatch(fetchCourseCohorts(courseId));
      }
    }, [courseId, userHasModerationPrivileges]);
  
   
    return (
        <>
        <div   onClick={open}>
            <img src= {iconFilter} alt='filter' />
        </div>
         <ModalPopup 
         positionRef={target}
         isOpen={isOpen}
        onClose={close}>
            <div className='modal-box-filter'>
            <Form>
          <div className="d-flex flex-row py-2 justify-content-between">
            <Form.RadioSet
              name="type"
              className="d-flex flex-column list-group list-group-flush"
              value={currentFilters.postType}
              onChange={handleSortFilterChange}
            >
              <ActionItem
                id="type-all"
                label={intl.formatMessage(messages.allPosts)}
                value={ThreadType.ALL}
                selected={currentFilters.postType}
              />
              <ActionItem
                id="type-discussions"
                label={intl.formatMessage(messages.filterDiscussions)}
                value={ThreadType.DISCUSSION}
                selected={currentFilters.postType}
              />
              <ActionItem
                id="type-questions"
                label={intl.formatMessage(messages.filterQuestions)}
                value={ThreadType.QUESTION}
                selected={currentFilters.postType}
              />
            </Form.RadioSet>
            <Form.RadioSet
              name="status"
              className="d-flex flex-column list-group list-group-flush"
              value={currentFilters.status}
              onChange={handleSortFilterChange}
            >
              <ActionItem
                id="status-any"
                label={intl.formatMessage(messages.filterAnyStatus)}
                value={PostsStatusFilter.ALL}
                selected={currentFilters.status}
              />
              <ActionItem
                id="status-unread"
                label={intl.formatMessage(messages.filterUnread)}
                value={PostsStatusFilter.UNREAD}
                selected={currentFilters.status}
              />
              {page !== 'my-posts' && (
                <ActionItem
                  id="status-following"
                  label={intl.formatMessage(messages.filterFollowing)}
                  value={PostsStatusFilter.FOLLOWING}
                  selected={currentFilters.status}
                />
              )}
              {(userHasModerationPrivileges || userIsGroupTa) && (
                <ActionItem
                  id="status-reported"
                  label={intl.formatMessage(messages.filterReported)}
                  value={PostsStatusFilter.REPORTED}
                  selected={currentFilters.status}
                />
              )}
              <ActionItem
                id="status-unanswered"
                label={intl.formatMessage(messages.filterUnanswered)}
                value={PostsStatusFilter.UNANSWERED}
                selected={currentFilters.status}
              />
              <ActionItem
                id="status-unresponded"
                label={intl.formatMessage(messages.filterUnresponded)}
                value={PostsStatusFilter.UNRESPONDED}
                selected={currentFilters.status}
              />
            </Form.RadioSet>
            <Form.RadioSet
              name="sort"
              className="d-flex flex-column list-group list-group-flush"
              value={currentSorting}
              onChange={handleSortFilterChange}
            >
              <ActionItem
                id="sort-activity"
                label={intl.formatMessage(messages.lastActivityAt)}
                value={ThreadOrdering.BY_LAST_ACTIVITY}
                selected={currentSorting}
              />
              <ActionItem
                id="sort-comments"
                label={intl.formatMessage(messages.commentCount)}
                value={ThreadOrdering.BY_COMMENT_COUNT}
                selected={currentSorting}
              />
              <ActionItem
                id="sort-votes"
                label={intl.formatMessage(messages.voteCount)}
                value={ThreadOrdering.BY_VOTE_COUNT}
                selected={currentSorting}
              />
            </Form.RadioSet>
          </div>
          {userHasModerationPrivileges && (
            <>
              <div className="border-bottom my-2" />
              {status === RequestStatus.IN_PROGRESS ? (
                <div className="d-flex justify-content-center p-4">
                  <Spinner animation="border" variant="primary" size="lg" />
                </div>
              ) : (
                <div className="d-flex flex-row pt-2">
                  <Form.RadioSet
                    name="cohort"
                    className="d-flex flex-column list-group list-group-flush w-100"
                    value={currentFilters.cohort}
                    onChange={handleSortFilterChange}
                  >
                    <ActionItem
                      id="all-groups"
                      label="All groups"
                      value=""
                      selected={currentFilters.cohort}
                    />
                    {cohorts.map(cohort => (
                      <ActionItem
                        key={cohort.id}
                        id={cohort.id}
                        label={capitalize(cohort.name)}
                        value={toString(cohort.id)}
                        selected={currentFilters.cohort}
                      />
                    ))}
                  </Form.RadioSet>
                </div>
              )}
            </>
          )}
        </Form>



            </div>
            </ModalPopup>
        
    </>
    )
}

export default injectIntl(PostFilterBarCustom);



