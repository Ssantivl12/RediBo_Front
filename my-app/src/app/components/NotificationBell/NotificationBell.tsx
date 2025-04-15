import React, { useState } from "react";
import { Bell } from "lucide-react"; 
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";



const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-[47px] left-[1739px]">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="w-12 h-12 text-orange-500" />
      </button>
      {open && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;
