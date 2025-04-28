import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  examSlug: undefined,
  name: "",
  description: "",
  tasks: [],
  answers: {},
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExamSlug: (state, action) => {
      return { ...state, examSlug: action.payload };
    },
    setExamName: (state, action) => {
      return { ...state, name: action.payload };
    },
    setExamDescription: (state, action) => {
      return { ...state, description: action.payload };
    },
    setExamTasks: (state, action) => {
      return { ...state, tasks: action.payload };
    },
    addExamAnswer: (state, action) => {
      const { taskId, answer } = action.payload;
      return { ...state, answers: { ...state.answers, [taskId]: answer } };
    },
    clearExamAnswer: (state, action) => {
      const taskId = action.payload;
      const updatedAnswers = { ...state.answers };
      delete updatedAnswers[taskId];
      return { ...state, answers: updatedAnswers };
    },
    clearExamAnswers: (state, action) => {
      return { ...state, answers: {} };
    },
  },
});

export const setExamName = examSlice.actions.setExamName;
export const setExamDescription = examSlice.actions.setExamDescription;
export const addExamAnswer = examSlice.actions.addExamAnswer;
export const setExamTasks = examSlice.actions.setExamTasks;
export const setExamSlug = examSlice.actions.setExamSlug;
export const clearExamAnswer = examSlice.actions.clearExamAnswer;
export const clearExamAnswers = examSlice.actions.clearExamAnswers;

export default examSlice.reducer;
