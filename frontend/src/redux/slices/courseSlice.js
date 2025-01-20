import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseData: {},
  currentLesson: undefined,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourseData: (state, action) => {
      return { ...state, courseData: action.payload };
    },
    setCurrentLesson: (state, action) => {
      return { ...state, currentLesson: action.payload };
    },
  },
});

export const setCourseData = courseSlice.actions.setCourseData;
export const setCurrentLesson = courseSlice.actions.setCurrentLesson;

export default courseSlice.reducer;
