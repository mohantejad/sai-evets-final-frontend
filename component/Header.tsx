"use client";

import Image from "next/image";
import SearchBar from "./utils/SearchBar";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { NavItems, authNavItems } from "@/data/navData";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { toast } from "react-toastify";



const Header = () => {
    const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authPages = [
    "/login",
    "/signup",
    "/activate",
    "/forgot-password",
    "/reset-password",
  ];
  const isAuthPage = authPages.includes(pathname);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      dispatch(logout());
      setMenuOpen(false);
      router.push("/");
      toast.success("Logged out successfully! 👋");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed! Please try again.");
    }
  };

  return (
    <header className="flex items-center justify-between px-10 shadow-[0_2px_2px_rgba(129,167,227,1)] py-2 bg-[#81a7e3]/10">
      <div className="flex md:items-center justify-center flex-col md:flex-row items-start space-x-2">
        <Link href="/">
          <Image src="/logo2.png" alt="Logo" width={74} height={74} />
        </Link>
        {!isAuthPage && (
          <div>
            <SearchBar />
          </div>
        )}
      </div>

      {!isAuthPage && isClient && (
        <div className="flex items-center space-x-4 uppercase text-[#004aad] -mt-12 md:mt-0">
          {NavItems.map((item) => (
            <Link
              key={item.text}
              href={item.link}
              className={`${item.desktopStyles} cursor-pointer`}
              onClick={() => setMenuOpen(false)}
            >
              {item.text}
            </Link>
          ))}

          {!isAuthenticated &&
            authNavItems.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className={`${item.desktopStyles} cursor-pointer`}
                onClick={() => setMenuOpen(false)}
              >
                {item.text}
              </Link>
            ))}

          {isAuthenticated && user ? (
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </div>

              {menuOpen && (
                <div className="absolute top-12 right-0 z-50 bg-white shadow-lg rounded-lg flex flex-col items-start text-[#004aad] uppercase">
                  {NavItems.map((item) => (
                    <Link
                      key={item.text}
                      href={item.link}
                      className={`${item.mobileStyles} cursor-pointer py-2 px-8 whitespace-nowrap w-full hover:bg-[#004aad]/10`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.text}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 cursor-pointer py-2 px-8 hover:bg-[#004aad]/10 w-full flex-start flex"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="cursor-pointer text-[#004aad]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </div>
          )}
        </div>
      )}

      {menuOpen && isClient && !isAuthPage && !user ? (
        <div className="absolute top-18 right-2 z-50 bg-white shadow-lg rounded-lg flex flex-col items-center text-[#004aad] uppercase ">
          {NavItems.map((item) => (
            <Link
              key={item.text}
              href={item.link}
              className={`${item.mobileStyles} cursor-pointer py-2 px-8 whitespace-nowrap w-full hover:bg-[#004aad]/10`}
              onClick={() => setMenuOpen(false)}
            >
              {item.text}
            </Link>
          ))}

          {!isAuthenticated &&
            authNavItems.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className={`${item.mobileStyles} cursor-pointer py-2 px-8 whitespace-nowrap w-full hover:bg-[#004aad]/10`}
                onClick={() => setMenuOpen(false)}
              >
                {item.text}
              </Link>
            ))}
        </div>
      ) : null}
    </header>
  )
}

export default Header