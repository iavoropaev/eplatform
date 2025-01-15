import { configureStore } from "@reduxjs/toolkit";
import createCollectionReducer from "./slices/createCollectionSlice";
import examSliceReducer from "./slices/examSlice";

const store = configureStore({
  reducer: {
    createCollection: createCollectionReducer,
    exam: examSliceReducer,
  },
});

export default store;
