import { configureStore } from '@reduxjs/toolkit'
import authReducer, { loginSuccess } from './authSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
})

const fetchUser = async () => {
    try {
        const response = await fetch("localhost:8000/auth/users/me/", {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const userData = await response.json();
            store.dispatch(loginSuccess({ user: userData }));
        }
    } catch (error) {
        console.error("Failed to fetch user:", error);
    }
}

fetchUser()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch