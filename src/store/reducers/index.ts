import { authReducer } from "./authReducer";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    auth: authReducer,
})