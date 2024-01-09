import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames';
import { useSelector } from 'react-redux';
import {
  Route, Switch, useLocation, useRouteMatch, matchPath ,Redirect
} from 'react-router';

// import Footer from '@edx/frontend-component-footer';
import { LearningHeader as Header } from '@edx/frontend-component-header';
import { getConfig } from '@edx/frontend-platform';

import { PostActionsBar, Search } from '../../components';
import { CourseTabsNavigation } from '../../components/NavigationBar';
import { ALL_ROUTES, DiscussionProvider, RequestStatus, Routes } from '../../data/constants';
import { DiscussionContext } from '../common/context';
import {
  useCourseDiscussionData, useIsOnDesktop, useRedirectToThread, useShowLearnersTab, useSidebarVisible,
} from '../data/hooks';
import { selectDiscussionProvider, selectconfigLoadingStatus } from '../data/selectors';
import { EmptyLearners, EmptyPosts, EmptyTopics } from '../empty-posts';
import messages from '../messages';
import { BreadcrumbMenu, LegacyBreadcrumbMenu, NavigationBar } from '../navigation';
import { postMessageToParent } from '../utils';
import BlackoutInformationBanner from './BlackoutInformationBanner';
import DiscussionContent from './DiscussionContent';
import DiscussionSidebar from './DiscussionSidebar';
import InformationBanner from './InformationsBanner';
import HeaderLearning from '../../header/HeaderLearning';
import Courses from '../courses/Courses';
import EmptyCourses from '../empty-posts/EmptyCourses';

import Dashboard from '../../dashboard/Dashboard';
import ActionNavbar from '../../dashboard/ActionNavbar';

import Footer from '../../footer/Footer';
import { PostsView } from '../posts';
import { TopicsView } from '../topics';
import PostEditorCustom from '../posts/post-editor/PostEditorCustom';




export default function DiscussionsHome() {
  const location = useLocation();
  const postActionBarRef = useRef(null);
  const postEditorVisible = useSelector(
    (state) => state.threads.postEditorVisible,
  );
  const {
    params: { page },
  } = useRouteMatch(`${Routes.COMMENTS.PAGE}?`);

  const { params: { path } } = useRouteMatch(`${Routes.DISCUSSIONS.PATH}/:path*`);
  const { params } = useRouteMatch(ALL_ROUTES);
  const isRedirectToLearners = useShowLearnersTab();
  const isFeedbackBannerVisible = getConfig().DISPLAY_FEEDBACK_BANNER === 'true';

  const {
    courseId,
    postId,
    topicId,
    category,
    learnerUsername,
  } = params;
  
  const inContext = new URLSearchParams(location.search).get('inContext') !== null;
  // Display the content area if we are currently viewing/editing a post or creating one.
  const displayContentArea = postId || postEditorVisible || (learnerUsername && postId);
  let displaySidebar = useSidebarVisible();

  const isOnDesktop = useIsOnDesktop();

  const { courseNumber, courseTitle, org } = useSelector((state) => state.courseTabs);
  if (displayContentArea) {
    // If the window is larger than a particular size, show the sidebar for navigating between posts/topics.
    // However, for smaller screens or embeds, only show the sidebar if the content area isn't displayed.
    displaySidebar = isOnDesktop;
  }

  const provider = useSelector(selectDiscussionProvider);
  useCourseDiscussionData(courseId);
  useRedirectToThread(courseId, inContext);
  useEffect(() => {
    if (path && path !== 'undefined') {
      postMessageToParent('discussions.navigate', { path });
    }
  }, [path]);



  const configStatus = useSelector(selectconfigLoadingStatus);
  const isCourseUrl = Boolean(matchPath(location.pathname, { path: Routes.COURSES.ALL }))
  return (
    <DiscussionContext.Provider value={{
      page,
      courseId,
      postId,
      topicId,
      inContext,
      category,
      learnerUsername,
    }}
    >
      {/* {!inContext && <Header courseOrg={org} courseNumber={courseNumber} courseTitle={courseTitle} />} */}
      {!inContext && <HeaderLearning  courseOrg={org} courseNumber={courseNumber} courseTitle={courseTitle}/>}
      <main className="container-fluid d-flex flex-column p-0 w-100" id="main" tabIndex="-1">
        <div >

        {!inContext && <CourseTabsNavigation activeTab="discussion" courseId={courseId} />}
        <div>
          <ActionNavbar courseTitle={courseTitle} />
          
        </div>
        {!inContext && (
          <Route
            path={[Routes.POSTS.PATH, Routes.TOPICS.CATEGORY]}
            component={provider === DiscussionProvider.LEGACY ? LegacyBreadcrumbMenu : BreadcrumbMenu}
          />
        )}

        <div >

         <div className='container' style={{maxWidth:'700px', minHeight:'700px'}}>
         <Switch>
              <Route path={Routes.COMMENTS.PATH} >
                    <div className='container'>
                      <DiscussionContent />
                    </div>
              </Route>
              <Route
                    path={[Routes.POSTS.PATH, Routes.POSTS.ALL_POSTS, Routes.TOPICS.CATEGORY, Routes.POSTS.MY_POSTS]}
                    component={PostsView}
                  />

              <Route path={Routes.DASHBOARD.PATH} >
                    <Dashboard />
              </Route>
              <Route path={Routes.POSTS.CREATE_POSTS} >
                   <PostEditorCustom />
                    
              </Route>
              {configStatus === RequestStatus.SUCCESSFUL && !isCourseUrl && (
                <Redirect
                    from={Routes.DISCUSSIONS.PATH}
                    to={{
                      ...location,
                      pathname: Routes.POSTS.ALL_POSTS,
                    }}
            />
          )}


          </Switch>
         </div>
         
        </div>
        </div>
      </main>

      {/* {!inContext &&  <Footer />} */}
    </DiscussionContext.Provider>
  );
}
