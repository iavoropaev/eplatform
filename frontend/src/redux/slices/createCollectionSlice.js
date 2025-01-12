import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  name: "",
  description: "",
  slug: "",
};

const createCollectionSlice = createSlice({
  name: "createCollection",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      return { ...state, tasks: action.payload };
    },
    setName: (state, action) => {
      return { ...state, name: action.payload };
    },
    setDescription: (state, action) => {
      return { ...state, description: action.payload };
    },
    setSlug: (state, action) => {
      return { ...state, slug: action.payload };
    },
  },
});

export const setTasks = createCollectionSlice.actions.setTasks;
export const setName = createCollectionSlice.actions.setName;
export const setDescription = createCollectionSlice.actions.setDescription;
export const setSlug = createCollectionSlice.actions.setSlug;

export default createCollectionSlice.reducer;
