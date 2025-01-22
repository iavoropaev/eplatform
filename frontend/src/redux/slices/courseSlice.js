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
    updateSolveStatus: (state, action) => {
      const id = action.payload.id;
      const updatedSections = state.currentLesson.sections.map((item) =>
        item.id === id ? { ...item, solve: action.payload.solve } : item
      );
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: updatedSections,
        },
      };
    },
  },
});

export const setCourseData = courseSlice.actions.setCourseData;
export const setCurrentLesson = courseSlice.actions.setCurrentLesson;
export const updateSolveStatus = courseSlice.actions.updateSolveStatus;

export default courseSlice.reducer;
