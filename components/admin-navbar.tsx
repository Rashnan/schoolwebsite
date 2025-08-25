"use client";

import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface AdminNavbarProps {
  activeTab: "admin" | "runners";
  onTabChange: (tab: "admin" | "runners") => void;
}

export default function AdminNavbar({
  activeTab,
  onTabChange,
}: AdminNavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // For example: clear tokens, redirect to login, etc.
    router.push("/signin");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside or switching focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleFocusChange = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('blur', handleFocusChange);
      window.addEventListener('focus', handleFocusChange);
      document.addEventListener('visibilitychange', handleFocusChange);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('blur', handleFocusChange);
      window.removeEventListener('focus', handleFocusChange);
      document.removeEventListener('visibilitychange', handleFocusChange);
    };
  }, [showDropdown]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="font-semibold text-[#1C398E] text-sm md:text-xl">
          {activeTab === "admin"
            ? "MNU Marathon Admin"
            : "MNU Marathon Runners"}
        </h1>

        {/* Navigation and Profile */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-full p-1">
            <Button
              variant="ghost"
              className={`px-3 md:px-6 py-2 text-xs md:text-sm rounded-full transition-colors ${
                activeTab === "admin"
                  ? "bg-[#1C398E] text-white hover:bg-[#1C398E]/90"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => onTabChange("admin")}
            >
              Admin
            </Button>
            <Button
              className={`px-3 md:px-6 py-2 text-xs md:text-sm rounded-full transition-colors ${
                activeTab === "runners"
                  ? "bg-[#1C398E] text-white hover:bg-[#1C398E]/90"
                  : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() => onTabChange("runners")}
            >
              Runners
            </Button>
          </div>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Avatar 
              className="h-8 w-8 md:h-10 md:w-10 cursor-pointer"
              onClick={toggleDropdown}
            >
              <AvatarImage src="/user-profile-illustration.png" />
              <AvatarFallback>
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </AvatarFallback>
            </Avatar>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
