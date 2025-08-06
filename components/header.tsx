"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  User,
  Bookmark,
  LogOut,
  Settings,
  SquaresUnite as SquaresUniteIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserFromCookie } from "@/action/user.action";
import { logoutUser } from "@/action/user.action";
import CustomButton from "./button";
import { useTheme } from "next-themes";
import Image from "next/image";
import JobLogo from "./JobLogo";
import SearchBar from "./search-bar";
import { useCompany } from "@/context/CompanyContext";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { setCompany, setHasCompany } = useCompany();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user) {
          const userData = await getUserFromCookie();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user from cookie:", error);
      }
    };

    fetchUser();
  }, [user, setUser]);

  // Fetch company data when user is available
  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/company?ownerId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setHasCompany(data.hasCompany);
          setCompany(data.company);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
        setHasCompany(false);
        setCompany(null);
      }
    };

    fetchCompany();
  }, [user?.id, setCompany, setHasCompany]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex fixed top-0 w-full font-poppins py-4 px-4 md:px-24 justify-between items-center backdrop-blur bg-card/95 z-50 shadow-lg rounded-b-2xl border-b border-border">
      <Link href={"/"}>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <JobLogo />
          </div>
          <h1 className="font-bold text-2xl max-sm:hidden tracking-wide text-card-foreground drop-shadow">
            JobHunt
          </h1>
        </div>
      </Link>

      {/* Search Bar */}
      <SearchBar />

      {/* Menus */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle button */}
        <button
          onClick={handleTheme}
          className="px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-card-foreground transition-colors duration-150"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {user ? (
          <div className="relative dropdown-container">
            {/* User Avatar Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-150 border border-border hover:border-ring"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getUserInitials(user.name)
                )}
              </div>

              {/* User Name (hidden on mobile) */}
              <span className="text-card-foreground font-medium max-sm:hidden">
                {user.name}
              </span>

              {/* Dropdown Arrow */}
              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold">
                      {user.profileImage ? (
                        <Image
                          src={user.profileImage}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getUserInitials(user.name)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-card-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <User size={18} className="text-muted-foreground" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/saved-jobs"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-card-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Bookmark size={18} className="text-muted-foreground" />
                    <span>Saved Jobs</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-card-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <Settings size={18} className="text-muted-foreground" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/add-company"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-card-foreground hover:bg-muted transition-colors duration-150"
                  >
                    <SquaresUniteIcon size={18} className="text-muted-foreground" />
                    <span>Add Company</span>
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-border my-1"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors duration-150 w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <CustomButton content={"Login"} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;