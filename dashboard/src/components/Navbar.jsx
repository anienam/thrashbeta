import { Bell } from "lucide-react";

export default function Navbar({ title }) {
  return (
    <header className="flex justify-between items-center h-18 px-8 bg-white border-b border-neutra-300 shadow-sm sticky top-0 z-10 w-full">
      {/* Title from props */}
      <h2 className="text-2xl font-semibold text-neutra-900 leading-tight">
        {title}
      </h2>

      <div className="flex items-center gap-4">
        {/* Notification Bell with Red Dot */}
        <button className="relative p-2.5 bg-neutra-100 hover:bg-neutra-200 rounded-full text-neutra-400 transition-colors border border-neutra-300">
          <Bell size={20} />
          {/* The Red Notification Dot */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FB3748] rounded-full border-2 border-[#FFD5D8]"></span>
        </button>

        {/* User Avatar */}
        <div className="cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full border border-neutral-200 object-cover"
            alt="User profile"
          />
        </div>
      </div>
    </header>
  );
}
