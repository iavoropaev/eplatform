import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const createCollectionSlice = createSlice({
  name: "createCollection",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      return { ...state, tasks: action.payload };
    },
  },
});

export default createCollectionSlice.reducer;
