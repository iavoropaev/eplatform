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
    deleteSolveStatus: (state, action) => {
      const sectionId = action.payload;
      const updatedSections = state.currentLesson.sections.map((item) =>
        item.id === sectionId ? { ...item, solve: {} } : item
      );
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: updatedSections,
        },
      };
    },

    changeSectionContent: (state, action) => {
      const sectionIndex = action.payload.index;
      const newContent = action.payload.content;
      const curSection = {
        ...state.currentLesson.sections[sectionIndex],
        content: newContent,
      };

      const newSections = [...state.currentLesson.sections];
      newSections[sectionIndex] = curSection;
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: newSections,
        },
      };
    },

    changeSectionTask: (state, action) => {
      const sectionIndex = action.payload.index;
      const newTask = action.payload.task;
      const sectionType =
        newTask && newTask?.answer_type !== "no_answer" ? "task" : "text";
      const curSection = {
        ...state.currentLesson.sections[sectionIndex],
        task: newTask,
        type: sectionType,
      };

      const newSections = [...state.currentLesson.sections];
      newSections[sectionIndex] = curSection;
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: newSections,
        },
      };
    },

    swapTwoSections: (state, action) => {
      const index1 = action.payload.index1;
      const index2 = action.payload.index2;

      const newSections = [...state.currentLesson.sections];
      [newSections[index1], newSections[index2]] = [
        newSections[index2],
        newSections[index1],
      ];
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: newSections,
        },
      };
    },
    addSection: (state, action) => {
      const newSection = action.payload;
      const newSections = [...state.currentLesson.sections, newSection];
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: newSections,
        },
      };
    },
    deleteSection: (state, action) => {
      const index = action.payload;

      const newSections = [...state.currentLesson.sections];
      newSections.splice(index, 1);
      return {
        ...state,
        currentLesson: {
          ...state.currentLesson,
          sections: newSections,
        },
      };
    },
    changeLessonName: (state, action) => {
      return {
        ...state,
        currentLesson: { ...state.currentLesson, name: action.payload },
      };
    },
  },
});

export const setCourseData = courseSlice.actions.setCourseData;
export const setCurrentLesson = courseSlice.actions.setCurrentLesson;
export const updateSolveStatus = courseSlice.actions.updateSolveStatus;
export const deleteSolveStatus = courseSlice.actions.deleteSolveStatus;

export const changeSectionContent = courseSlice.actions.changeSectionContent;
export const changeSectionTask = courseSlice.actions.changeSectionTask;
export const addSection = courseSlice.actions.addSection;
export const deleteSection = courseSlice.actions.deleteSection;
export const swapTwoSections = courseSlice.actions.swapTwoSections;
export const changeLessonName = courseSlice.actions.changeLessonName;

export default courseSlice.reducer;
