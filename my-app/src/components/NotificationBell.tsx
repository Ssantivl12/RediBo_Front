"use client";

import { FiBell } from "react-icons/fi";

interface Props {
  unviewedCount: number;
  onClick: () => void;
}

export default function NotificationBell({ unviewedCount, onClick }: Props) {
  return (
    <button
      data-id="notification-bell"
      onClick={onClick}
      className="relative p-1.5 sm:p-2 border-2 border-orange-400 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-md hover:ring-2 hover:ring-orange-300 cursor-pointer"
    >
      <FiBell className="text-orange-500 text-lg sm:text-xl" />
      {unviewedCount > 0 && (
        <span className="absolute top-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full" />
      )}
    </button>
  );
}
