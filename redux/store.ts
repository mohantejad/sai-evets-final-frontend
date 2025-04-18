import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loginSuccess } from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export const fetchUser = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return;

  try {
    const response = await fetch("http://localhost:8000/auth/users/me/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      store.dispatch(loginSuccess({ user: userData }));
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
