"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";

const WithAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function AuthComponent(props: P) {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      if (!user) {
        router.push("/login");
      }
    }, [user, router]);

    if (!isMounted || !user) return null;

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
