import React, { useEffect } from "react";
import PropTypes from "prop-types";

import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { getConfig } from "@edx/frontend-platform";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";

import { fetchTab } from "./data/thunks";
import Tabs from "./tabs/Tabs";
import messages from "./messages";
import { setCourseInRun } from "./data/slice";

import "./navBar.scss";

function CourseTabsNavigation({
  activeTab,
  className,
  intl,
  courseId,
  rootSlug,
}) {
  const dispatch = useDispatch();

  const tabs = useSelector((state) => state.courseTabs.tabs);
  useEffect(() => {
    dispatch(fetchTab(courseId, rootSlug));
  }, [courseId]);

  const courseInRun = useSelector((state) => state.courseTabs.courseInRun);

  //get running course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const url = `${getConfig().LMS_BASE_URL}/api/learner_home/init`;
        const { data } = await getAuthenticatedHttpClient().get(url);

        const lesson_url = window.location.href;

        const regex = /course-v1:([^/]+)/;
        const course_id = lesson_url.match(regex)[0];
        const course = data.courses.find(
          (course) => course.courseRun.courseId === course_id
        );
        if (course) {
          dispatch(setCourseInRun(course));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCourse();
    return () => {
      fetchCourse();
    };
  }, [dispatch]);

  return (
    <div
      id="courseTabsNavigation"
      className={classNames("course-tabs-navigation mb-3", className)}
    >
      <div className="sub-header-container">
        {!!tabs.length && (
          <Tabs
            className="nav-underline-tabs d-flex sub-header-content"
            aria-label={intl.formatMessage(messages.courseMaterial)}
          >
            {tabs.map(({ url, title, slug }, index) => {
              const resumeUrl = courseInRun?.courseRun.resumeUrl
                ? `${getConfig().LMS_BASE_URL}${
                    courseInRun.courseRun.resumeUrl
                  }`
                : url;
              const href = index === 0 ? resumeUrl : url;
              return (
                <a
                  key={slug}
                  className={classNames("nav-item flex-shrink-0 nav-link", {
                    active: slug === activeTab,
                  })}
                  href={href}
                >
                  {title}
                </a>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
}

CourseTabsNavigation.propTypes = {
  activeTab: PropTypes.string,
  className: PropTypes.string,
  rootSlug: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTab: undefined,
  className: null,
  rootSlug: "outline",
};

export default injectIntl(CourseTabsNavigation);
