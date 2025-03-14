"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSessionContext } from "@/app/components/SessionWrapper";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { session, logout } = useSessionContext();
  const router = useRouter(); // ✅ Faster client-side navigation

  const handleNavigation = (path) => {
    setIsOpen(false); // ✅ Close menu on mobile after clicking
    router.push(path); // ✅ Instant navigation
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold cursor-pointer" onClick={() => handleNavigation("/")}>
            AI Feedback
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {session ? (
              <>
                <button onClick={() => handleNavigation("/")} className="hover:text-blue-400">Home</button>
                <button onClick={() => handleNavigation("/dashboard")} className="hover:text-blue-400">Dashboard</button>
                <button onClick={() => handleNavigation("/feedback")} className="hover:text-blue-400">Feedback</button>
                <button onClick={() => handleNavigation("/profile")} className="hover:text-blue-400">Profile</button>
                <button onClick={logout} className="hover:text-red-400">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigation("/")} className="hover:text-blue-400">Home</button>
                <button onClick={() => handleNavigation("/login")} className="hover:text-blue-400">Login</button>
                <button onClick={() => handleNavigation("/signup")} className="hover:text-green-400">Signup</button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden space-y-2 p-4 bg-gray-800">
            {session ? (
              <>
                <button onClick={() => handleNavigation("/")} className="block text-center hover:text-blue-400">Home</button>
                <button onClick={() => handleNavigation("/dashboard")} className="block text-center hover:text-blue-400">Dashboard</button>
                <button onClick={() => handleNavigation("/feedback")} className="block text-center hover:text-blue-400">Feedback</button>
                <button onClick={logout} className="block text-center hover:text-red-400 w-full">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigation("/")} className="block text-center hover:text-blue-400">Home</button>
                <button onClick={() => handleNavigation("/login")} className="block text-center hover:text-blue-400">Login</button>
                <button onClick={() => handleNavigation("/signup")} className="block text-center hover:text-green-400">Signup</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
