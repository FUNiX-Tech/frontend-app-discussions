/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

export const LOADING = "loading";
export const LOADED = "loaded";
export const FAILED = "failed";
export const DENIED = "denied";

const slice = createSlice({
  name: "courseTabs",
  initialState: {
    courseStatus: "loading",
    courseId: null,
    tabs: [],
    courseTitle: null,
    courseNumber: null,
    org: null,
    courseInRun: null,
  },
  reducers: {
    fetchTabDenied: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = DENIED;
    },
    fetchTabFailure: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = FAILED;
    },
    fetchTabRequest: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.courseStatus = LOADING;
    },
    fetchTabSuccess: (state, { payload }) => {
      state.courseId = payload.courseId;
      state.targetUserId = payload.targetUserId;
      state.tabs = payload.tabs;
      state.courseStatus = LOADED;
      state.courseTitle = payload.courseTitle;
      state.courseNumber = payload.courseNumber;
      state.org = payload.org;
    },
    setCourseInRun: (state, { payload }) => {
      state.courseInRun = payload;
    },
  },
});

export const {
  fetchTabDenied,
  fetchTabFailure,
  fetchTabRequest,
  fetchTabSuccess,
  setCourseInRun,
} = slice.actions;

export const courseTabsReducer = slice.reducer;
