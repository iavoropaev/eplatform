import { configureStore } from "@reduxjs/toolkit";
import createCollectionSliceReducer from "./slices/createCollectionSlice";
import examSliceReducer from "./slices/examSlice";
import courseSliceReducer from "./slices/courseSlice";

const store = configureStore({
  reducer: {
    createCollection: createCollectionSliceReducer,
    exam: examSliceReducer,
    course: courseSliceReducer,
  },
});

export default store;
