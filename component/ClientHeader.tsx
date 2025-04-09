"use client";

import Header from "./Header";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";

export default function ClientHeader() {

  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(loginSuccess({ user: JSON.parse(storedUser) }));
    }
  }, [dispatch])
  return <Header />;
}
