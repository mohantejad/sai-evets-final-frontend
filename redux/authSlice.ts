import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    id: number;
    first_name: string
    last_name: string
    email: string;
    profile_picture?: string;
  } | null;
  isAuthenticated: boolean;
}

const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: storedUser ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any }>) => {
      state.user = {
        id: action.payload.user.id,
        first_name: action.payload.user.first_name,
        last_name: action.payload.user.last_name,
        email: action.payload.user.email,
        profile_picture: action.payload.user.profile_picture || "",
      };
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(state.user))
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken")
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
