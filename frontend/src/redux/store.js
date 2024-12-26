import { configureStore } from "@reduxjs/toolkit";
import createCollectionReducer from "./slices/createCollectionSlice";
const store = configureStore({
  reducer: {
    createCollection: createCollectionReducer,
  },
});

export default store;
