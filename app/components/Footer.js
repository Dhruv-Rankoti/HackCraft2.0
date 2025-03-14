import Link from "next/link";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 bottom-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Branding */}
        <div className="text-xl font-bold">
          <Link href="/">AI Feedback</Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/feedback" className="hover:text-blue-400">Feedback</Link>
          <Link href="/profile" className="hover:text-blue-400">Profile</Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook className="w-6 h-6 hover:text-blue-500" /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter className="w-6 h-6 hover:text-blue-400" /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin className="w-6 h-6 hover:text-blue-600" /></a>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-sm mt-4">
        © {new Date().getFullYear()} AI Feedback. All Rights Reserved.
      </div>
    </footer>
  );
}
