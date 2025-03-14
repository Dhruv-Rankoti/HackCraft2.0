"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSessionContext } from "@/app/components/SessionWrapper";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { session, logout } = useSessionContext(); // Use `logout()` instead of `signOut()`

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link href="/">AI Feedback</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {session ? (
              <>
                <Link href="/" className="hover:text-blue-400 cursor-pointer">Home</Link>
                <Link href="/dashboard" className="hover:text-blue-400 cursor-pointer">Dashboard</Link>
                <Link href="/feedback" className="hover:text-blue-400">Feedback</Link>
                <button onClick={logout} className="hover:text-red-400 cursor-pointer">Logout</button>
              </>
            ) : (
              <>
                <Link href="/" className="hover:text-blue-400 cursor-pointer">Home</Link>
                <Link href="/login" className="hover:text-blue-400">Login</Link>
                <Link href="/signup" className="hover:text-green-400">Signup</Link>
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
                <Link href="/" className="hover:text-blue-400 cursor-pointer">Home</Link>
                <Link href="/dashboard" className="hover:text-blue-400 cursor-pointer">Dashboard</Link>
                <Link href="/feedback" className="hover:text-blue-400">Feedback</Link>
                <button onClick={logout} className="hover:text-red-400 cursor-pointer">Logout</button>
              </>
            ) : (
              <>
                <Link href="/" className="hover:text-blue-400 cursor-pointer">Home</Link>
                <Link href="/login" className="block text-center hover:text-blue-400">Login</Link>
                <Link href="/signup" className="block text-center hover:text-green-400">Signup</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
