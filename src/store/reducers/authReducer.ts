import { createSlice } from "@reduxjs/toolkit";

export type User = {

    name: string;
    email: string;
    role: string;
    phone: string;
    uid: string

}
type AuthState = {
    user: User | null
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            console.log(state.user)
        },
        setToken: (state, action) => {
            state.token = action.payload;
            console.log(state.token)
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
        }
    }
})

export const { setUser, setToken, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;