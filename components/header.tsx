"use client";

import React, { useEffect, useState } from "react";
import {
  SearchIcon,
  ChevronDown,
  User,
  Bookmark,
  LogOut,
  Settings,
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
import { suggestJobs } from "@/action/job.action";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; title: string }[]>([]);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user, setUser } = useAuth();

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


  useEffect(()=>{
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500);
    return  () =>{
      clearTimeout(timer)
    } 
  },[searchQuery])


  useEffect(()=>{
    const getSuggestions = async () =>{
      if(debouncedQuery.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const data = await suggestJobs(debouncedQuery);
        
        if (data.success) {
          setSuggestions(data.suggestions ?? []);
        } else {
          console.error("Failed to fetch suggestions:", data.message);
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching job suggestions:", error);
        setSuggestions([]);
      }
    }
    getSuggestions();
  },[debouncedQuery])

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

  const handleClick = () => {
    if (searchQuery.trim()) {
      console.log(searchQuery);
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

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
            <JobLogo/>
          </div>
          <h1 className="font-bold text-2xl max-sm:hidden tracking-wide text-card-foreground drop-shadow">
            JobHunt
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 max-w-[600px] items-center bg-muted rounded-full px-3 py-1 shadow-inner border border-border mx-4 min-w-[220px] relative">
        <input
          type="text"
          className="bg-transparent border-none outline-none text-lg px-2 py-1 text-card-foreground placeholder:text-muted-foreground flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search jobs..."
        />
        <button
          onClick={handleClick}
          className="rounded-full p-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-150 text-muted-foreground"
          disabled={!searchQuery.trim()}
        >
          <SearchIcon size={18} />
        </button>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-2 hover:bg-muted transition-colors duration-150 cursor-pointer text-card-foreground"
                onClick={() => {
                  setSearchQuery(suggestion.title);
                  setSuggestions([]);
                  router.push(`/?q=${encodeURIComponent(suggestion.title)}`);
                }}
              >
                {suggestion.title}
              </div>
            ))}
          </div>
        )}
      </div>

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
