import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  tasks: [],
  answers: {},
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExamName: (state, action) => {
      return { ...state, name: action.payload };
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
export const addExamAnswer = examSlice.actions.addExamAnswer;
export const setExamTasks = examSlice.actions.setExamTasks;
export const clearExamAnswer = examSlice.actions.clearExamAnswer;
export const clearExamAnswers = examSlice.actions.clearExamAnswers;

export default examSlice.reducer;
