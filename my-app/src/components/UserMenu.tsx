"use client";

import { useState } from "react";
import { FiUser } from "react-icons/fi";

export default function UserMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-400 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FiUser className="text-white text-lg sm:text-xl" />
      </div>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-orange-100 transition cursor-pointer">
                Mis Autos
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
