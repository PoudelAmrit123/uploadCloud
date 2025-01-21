import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userDetails/userSlice'
import fileReducer from './features/fileDetails/fileSlice'

const store = configureStore({
  reducer: {
    user : userReducer,
    file : fileReducer,

  },
});

export default store;
