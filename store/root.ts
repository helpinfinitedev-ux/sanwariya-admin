import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import products from "./slices/productSlice";
import users from "./slices/userSlice";
import testimonials from "./slices/testimonialSlice";
import categories from "./slices/categorySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  products,
  users,
  testimonials,
  categories,
});

export default rootReducer;
